import React from 'react'
import tw from 'twin.macro'
import Link from 'next/link'
import { useTable } from 'react-table'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import * as Icon from '../../../../../icons'
import { useUser } from '../../../../../lib/user'
import Layout from '../../../../../sections/layout'
import QUERIES from '../../../../../graphql/queries'
import { Empty, Loader, Table as MyTable } from '../../../../../components'

const Category = () => {
   const { user } = useUser()
   const router = useRouter()

   const {
      loading,
      error,
      data: { category = {} } = {},
   } = useQuery(QUERIES.CATEGORIES.ONE_WITH_SUB_CATEGORIES, {
      skip: !user?.id || !router.isReady || !router.query.id,
      variables: {
         id: router.query.id,
         where: {
            _or: [
               { user_id: { _eq: user.id } },
               { user_id: { _is_null: true } },
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
         {
            Header: 'Owned',
            alignment: 'center',
            width: 120,
            Cell: ({ cell }: any) => {
               const isOwned = cell.row.original.user_id === user.id
               if (isOwned)
                  return (
                     <span tw="flex justify-center">
                        <Icon.Tick tw="stroke-current" />
                     </span>
                  )
               return (
                  <span tw="flex justify-center">
                     <Icon.Cross tw="stroke-current" />
                  </span>
               )
            },
         },
         {
            Header: 'Actions',
            width: 120,
            alignment: 'center',
            no_padding: true,
            Cell: ({ cell }: any) => {
               if (cell.row.original.user_id !== user.id) return null
               return (
                  <div tw="flex lg:hidden group-hover:flex w-full h-full justify-center p-1 gap-2">
                     <EditButton
                        goto={router.push}
                        username={user.username}
                        id={cell.row.original.id}
                        parent_id={router.query.id ?? ''}
                     />
                  </div>
               )
            },
         },
      ],
      []
   )
   return (
      <Layout>
         {loading ? (
            <Loader />
         ) : (
            <>
               {error ? (
                  <p tw="text-gray-400">
                     Something went wrong, please refresh the page.
                  </p>
               ) : (
                  <>
                     <header tw="px-4 pt-4 flex items-center space-x-3">
                        <h1
                           title={category?.title}
                           tw="font-heading text-2xl font-medium text-gray-400"
                        >
                           {category.title}
                        </h1>
                        {category?.user_id === user.id && (
                           <Link
                              href={`/${user.username}/settings/categories/create?id=${router.query.id}`}
                           >
                              <a
                                 title="Edit Category"
                                 tw="cursor-pointer h-10 w-10 border border-dark-200 flex items-center justify-center hover:bg-dark-300"
                              >
                                 <Icon.Edit tw="fill-current text-white" />
                              </a>
                           </Link>
                        )}
                     </header>
                     <main tw="p-4">
                        <header tw="mb-2 flex items-center space-x-3">
                           <h3 tw="text-lg text-gray-400">Sub Categories</h3>
                           <Link
                              href={`/${user.username}/settings/categories/${router.query.id}/create`}
                           >
                              <a
                                 title="Create Sub Category"
                                 tw="cursor-pointer h-8 w-8 border border-dark-200 flex items-center justify-center hover:bg-dark-300"
                              >
                                 <Icon.Add
                                    size={16}
                                    tw="stroke-current text-white"
                                 />
                              </a>
                           </Link>
                        </header>
                        {category.sub_categories?.length === 0 ? (
                           <Empty message="Create a sub category to begin" />
                        ) : (
                           <Table
                              columns={columns}
                              categories={category.sub_categories}
                           />
                        )}
                     </main>
                  </>
               )}
            </>
         )}
      </Layout>
   )
}

export default Category

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
                                 {...(column.alignment === 'right' && {
                                    is_right: true,
                                 })}
                                 {...(column.alignment === 'center' && {
                                    is_center: true,
                                 })}
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
                                 {...(cell.column.alignment === 'right' && {
                                    is_right: true,
                                 })}
                                 {...(cell.column.alignment === 'center' && {
                                    is_center: true,
                                 })}
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

interface EditButtonProps {
   id: string
   username: string
   parent_id: string | string[]
   goto: (path: string) => void
}

const EditButton = (props: EditButtonProps): JSX.Element => {
   const { id, goto, username, parent_id } = props
   return (
      <button
         title="Edit Category"
         onClick={() =>
            goto(
               `/${username}/settings/categories/${parent_id}/create?id=${id}`
            )
         }
         tw="w-6 flex items-center justify-center rounded hover:bg-dark-300"
      >
         <Icon.Edit size={16} tw="fill-current text-gray-400" />
      </button>
   )
}
