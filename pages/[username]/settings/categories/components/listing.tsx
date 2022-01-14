import React from 'react'
import tw, { styled } from 'twin.macro'
import { useTable } from 'react-table'
import { useQuery } from '@apollo/client'

import { useUser } from '../../../../../lib/user'
import QUERIES from '../../../../../graphql/queries'
import { Loader, Table as MyTable } from '../../../../../components'

interface ICategory {
   id: string
   title: string
   type: 'expense' | 'income'
   sub_categories: {
      aggregate: {
         count: number
      }
      nodes: ISubCategory[]
   }
}

interface ISubCategory {
   id: string
   title: string
}

const Listing = () => {
   const { user } = useUser()
   const [selectedCategory, setSelectedCategory] =
      React.useState<ICategory | null>(null)

   const {
      loading,
      error,
      data: { categories = {} } = {},
   } = useQuery(QUERIES.CATEGORIES.LIST, {
      skip: !user?.id,
      variables: {
         where: {
            _or: [
               { user_id: { _eq: user.id } },
               { user_id: { _is_null: true } },
            ],
         },
      },
   })

   if (loading) return <Loader />
   if (error) return <p>Something went wrong, please refresh the page.</p>
   if (categories.aggregate.count === 0)
      return <p tw="text-gray-400">Please start by creating a category.</p>
   return (
      <Styles.Container>
         <Styles.Aside>
            <Styles.CategoriesList>
               {categories.nodes.map((category: ICategory) => (
                  <Styles.Category
                     key={category.id}
                     onClick={() => setSelectedCategory(category)}
                     is_selected={category.id === selectedCategory?.id}
                  >
                     {category.title}
                  </Styles.Category>
               ))}
            </Styles.CategoriesList>
            <Styles.CategoriesSelect
               value={selectedCategory?.id}
               onChange={e =>
                  setSelectedCategory(
                     categories.nodes.find(node => node.id === e.target.value)
                  )
               }
            >
               {categories.nodes.map((category: ICategory) => (
                  <option key={category.id} value={category.id}>
                     {category.title}
                  </option>
               ))}
            </Styles.CategoriesSelect>
         </Styles.Aside>
         <main tw="flex-1 p-3">
            {selectedCategory?.id ? (
               <SubCategoryListing selectedCategory={selectedCategory} />
            ) : (
               <p tw="text-gray-400">
                  Select a category to view sub categories
               </p>
            )}
         </main>
      </Styles.Container>
   )
}

export default Listing

const SubCategoryListing = ({ selectedCategory = {} }) => {
   const { user } = useUser()
   const {
      loading,
      error,
      data: { categories = {} } = {},
   } = useQuery(QUERIES.SUB_CATEGORIES.LIST, {
      skip: !user?.id || !selectedCategory?.id,
      variables: {
         where: {
            category_id: {
               _eq: selectedCategory?.id,
            },
            _or: [
               {
                  user_id: {
                     _eq: user.id,
                  },
               },
               {
                  user_id: {
                     _is_null: true,
                  },
               },
            ],
         },
      },
   })
   const columns = React.useMemo(
      () => [
         {
            Header: 'Title',
            accessor: 'title',
         },
      ],
      []
   )
   if (loading) return <Loader />
   if (error)
      return (
         <p tw="text-gray-400">
            Something went wrong, please refresh the page.
         </p>
      )
   if (categories.aggregate.count === 0)
      return <p tw="text-gray-400">No sub categories found.</p>
   return (
      <>
         <h2 tw="text-lg font-medium text-gray-400 mb-3">
            Sub Categories for {selectedCategory?.title}
         </h2>
         <Table columns={columns} categories={categories.nodes} />
      </>
   )
}

const Table = ({ columns = [], categories = [] }) => {
   const { rows, prepareRow, headerGroups, getTableProps, getTableBodyProps } =
      useTable({
         columns,
         data: categories,
      })
   return (
      <main tw="overflow-x-auto">
         <MyTable {...getTableProps()}>
            <MyTable.Head>
               {headerGroups.map(headerGroup => {
                  const { key: header_group_key, ...rest_header_group } =
                     headerGroup.getHeaderGroupProps()
                  return (
                     <MyTable.Row key={header_group_key} {...rest_header_group}>
                        {headerGroup.headers.map(column => {
                           const { key: column_key, ...rest_column } =
                              column.getHeaderProps()
                           return (
                              <MyTable.HCell
                                 key={column_key}
                                 {...rest_column}
                                 is_right={column.alignment === 'right'}
                              >
                                 {column.render('Header')}
                              </MyTable.HCell>
                           )
                        })}
                     </MyTable.Row>
                  )
               })}
            </MyTable.Head>

            <MyTable.Body {...getTableBodyProps()}>
               {rows.map((row, i) => {
                  prepareRow(row)
                  const { key: row_key, ...rest_row_keys } = row.getRowProps()
                  return (
                     <MyTable.Row key={row_key} {...rest_row_keys}>
                        {row.cells.map(cell => {
                           const { key: cell_key, ...rest_cell_keys } =
                              cell.getCellProps()
                           return (
                              <MyTable.Cell
                                 key={cell_key}
                                 {...rest_cell_keys}
                                 is_right={cell.column.alignment === 'right'}
                                 {...(cell.column.id !== 'title' && {
                                    width: cell.column.width,
                                 })}
                              >
                                 {cell.render('Cell')}
                              </MyTable.Cell>
                           )
                        })}
                     </MyTable.Row>
                  )
               })}
            </MyTable.Body>
         </MyTable>
      </main>
   )
}

const Styles = {
   Container: styled.div({
      ...tw`h-[calc(100% - 68px)] flex mt-4 border-t border-dark-200`,
      '@tablet': { ...tw`h-auto flex-col` },
   }),
   Aside: styled.aside({
      ...tw`w-[240px] h-full border-r border-dark-200`,
      '@tablet': { ...tw`w-full border-r-0 border-b p-2` },
   }),
   CategoriesList: styled.ul({
      ...tw`p-1`,
      '@tablet': { ...tw`hidden` },
   }),
   CategoriesSelect: styled.select({
      ...tw`hidden rounded w-full h-10 px-1 bg-dark-300 text-white focus:outline-none`,
      '@tablet': { ...tw`block` },
   }),
   Category: styled.li({
      ...tw`px-2 cursor-pointer text-gray-400 hover:bg-dark-300 h-8 flex items-center`,
      variants: {
         is_selected: { true: { ...tw`bg-dark-300` } },
      },
   }),
}
