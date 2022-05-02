import React from 'react'
import tw from 'twin.macro'
import Dinero from 'dinero.js'
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

   const [delete_account] = useMutation(MUTATIONS.ACCOUNTS.DELETE, {
      refetchQueries: ['accounts'],
      onCompleted: () =>
         addToast('Successfully deleted the account', {
            appearance: 'success',
         }),
      onError: () =>
         addToast('Failed to delete the account', { appearance: 'error' }),
   })

   const {
      loading,
      error,
      data: { accounts = {} } = {},
   } = useQuery(QUERIES.ACCOUNTS.LIST, {
      skip: !user?.id,
      variables: { userid: user.id, where: { user_id: { _eq: user.id } } },
   })

   const columns = React.useMemo(
      () => [
         {
            Header: 'Title',
            accessor: 'title',
         },
         {
            Header: 'Balance',
            accessor: 'amount',
            alignment: 'right',
            Cell: ({ cell }): string =>
               Dinero({ amount: cell.value, currency: 'INR' }).toFormat(),
         },
         {
            Header: 'Transactions',
            accessor: 'transactions_count',
            alignment: 'right',
         },
         {
            Header: 'Actions',
            width: 120,
            alignment: 'center',
            no_padding: true,
            Cell: ({ cell }: any) => {
               return (
                  <div tw="flex lg:hidden group-hover:flex w-full h-full justify-center p-1 gap-2">
                     <button
                        title="Edit Account"
                        onClick={() =>
                           router.push(
                              `/${user.username}/accounts/create?id=${cell.row.original.id}`
                           )
                        }
                        tw="w-6 flex items-center justify-center rounded hover:bg-dark-300"
                     >
                        <Icon.Edit size={16} tw="fill-current text-gray-400" />
                     </button>
                     <button
                        title="Delete Account"
                        onClick={() =>
                           delete_account({
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
            },
         },
      ],
      []
   )

   if (loading) return <Loader />
   if (error) return <p>Something went wrong, please refresh the page.</p>
   if (accounts?.aggregate?.count === 0)
      return <Empty message="Create an account to begin" />

   return (
      <main tw="p-4">
         <Table columns={columns} categories={accounts.nodes} />
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
