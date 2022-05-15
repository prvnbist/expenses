import React from 'react'
import tw from 'twin.macro'
import { useTable } from 'react-table'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useQuery } from '@apollo/client'

import * as Icon from 'icons'
import { useUser } from 'lib/user'
import QUERIES from 'graphql/queries'
import { MUTATIONS } from 'graphql/mutations'
import { Empty, Loader, Table as MyTable } from 'components'

const Listing = () => {
   const { user } = useUser()
   const router = useRouter()
   const { addToast } = useToasts()

   const [delete_category] = useMutation(MUTATIONS.CATEGORIES.DELETE, {
      refetchQueries: ['categories'],
      onCompleted: () =>
         addToast('Successfully deleted the category', {
            appearance: 'success',
         }),
      onError: () =>
         addToast('Failed to delete the category', { appearance: 'error' }),
   })

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

   const columns = React.useMemo(
      () => [
         {
            Header: 'Title',
            accessor: 'title',
         },
         {
            Header: 'Type',
            accessor: 'type',
            Cell: ({ cell }): string =>
               cell.value.replace(/./, (c: string) => c.toUpperCase()),
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
               if (cell.row.original.user_id === user.id)
                  return (
                     <div tw="flex lg:hidden group-hover:flex w-full h-full justify-center p-1 gap-2">
                        <EditButton
                           goto={router.push}
                           id={cell.row.original.id}
                        />
                        <button
                           title="Delete Category"
                           onClick={() =>
                              delete_category({
                                 variables: { id: cell.row.original.id },
                              })
                           }
                           tw="w-6 flex items-center justify-center rounded hover:bg-dark-300"
                        >
                           <Icon.Delete
                              size={16}
                              tw="stroke-current text-gray-400"
                           />
                        </button>
                     </div>
                  )
               return null
            },
         },
      ],
      []
   )

   if (loading) return <Loader />
   if (error) return <p>Something went wrong, please refresh the page.</p>
   if (categories?.aggregate?.count === 0)
      return <Empty message="Create a category to begin" />

   return (
      <main tw="p-4">
         <Table columns={columns} categories={categories.nodes} />
      </main>
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

export default Listing

interface EditButtonProps {
   id: string
   goto: (path: string) => void
}

const EditButton = (props: EditButtonProps): JSX.Element => {
   const { id, goto } = props
   return (
      <button
         title="Edit Category"
         onClick={() => goto(`/settings/categories/create?id=${id}`)}
         tw="w-6 flex items-center justify-center rounded hover:bg-dark-300"
      >
         <Icon.Edit size={16} tw="fill-current text-gray-400" />
      </button>
   )
}
