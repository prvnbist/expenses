import React from 'react'
import tw from 'twin.macro'
import Dinero from 'dinero.js'
import { useRouter } from 'next/router'
import { styled } from '@stitches/react'
import { useTable, usePagination } from 'react-table'

import * as Icon from '../../../../icons'
import { useUser } from '../../../../lib/user'
import { Empty, Table as MyTable } from '../../../../components'

interface ITransaction {
   id: string
   type: string
   date: string
   title: string
   amount: number
   raw_date: string
}
interface ITableProps {
   childRef: {
      current: (input: number) => void | null
   }
   transactions: ITransaction[]
   pagination: {
      page: number
      size: number
      count: number
   }
   onPageChange: (input: number) => void
}

const Table = ({
   childRef,
   transactions = [],
   pagination,
   onPageChange,
}: ITableProps): JSX.Element => {
   const { user } = useUser()
   const router = useRouter()
   const columns = React.useMemo(
      () => [
         {
            Header: 'Title',
            accessor: 'title',
            type: 'text',
         },
         {
            Header: 'Amount',
            accessor: 'amount',
            type: 'numeric',
            width: 180,
            alignment: 'right',
            Cell: ({ cell }: any) => {
               const type = cell.row.original.type
               return (
                  <Styles.Amount is_expense={type === 'expense'}>
                     {type === 'expense' ? '-' : '+'}
                     {Dinero({
                        amount: cell.value,
                        currency: 'INR',
                     }).toFormat()}
                  </Styles.Amount>
               )
               return ''
            },
         },
         {
            Header: 'Date',
            accessor: 'date',
            type: 'date',
            width: 180,
            alignment: 'right',
         },
         {
            Header: 'Category',
            accessor: 'category',
            type: 'text',
            width: 180,
         },
      ],
      []
   )

   const {
      prepareRow,
      headerGroups,
      getTableProps,
      getTableBodyProps,
      page,
      gotoPage,
      canNextPage,
      pageOptions,
      canPreviousPage,
      state: { pageIndex },
   } = useTable(
      {
         columns,
         data: transactions,
         manualPagination: true,
         pageCount: pagination.count - 1,
         initialState: {
            pageSize: 10,
            pageIndex: 0,
         },
      },
      usePagination
   )

   React.useEffect(() => {
      childRef.current = gotoPage
   }, [childRef, gotoPage])

   const switchPage = (page: number) => {
      gotoPage(page)
      onPageChange(page)
   }

   return (
      <>
         <Pagination
            {...{
               pageIndex,
               switchPage,
               pageOptions,
               canNextPage,
               canPreviousPage,
            }}
         />
         <Styles.Container>
            <MyTable {...getTableProps()}>
               <MyTable.Head>
                  {headerGroups.map(headerGroup => {
                     const { key: header_group_key, ...rest_header_group } =
                        headerGroup.getHeaderGroupProps()
                     return (
                        <MyTable.Row
                           key={header_group_key}
                           {...rest_header_group}
                        >
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
                  {page.map((row, i) => {
                     prepareRow(row)
                     const { key: row_key, ...rest_row_keys } =
                        row.getRowProps()
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
                                    {...(cell.column.id === 'title' && {
                                       on_hover: true,
                                       onClick: () =>
                                          router.push(
                                             `/${user.username}/transactions/create?id=${cell.row.original.id}`
                                          ),
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
            {transactions.length === 0 && (
               <Empty message="Create a transaction to begin" />
            )}
         </Styles.Container>
         <Pagination
            {...{
               pageIndex,
               switchPage,
               pageOptions,
               canNextPage,
               canPreviousPage,
            }}
         />
      </>
   )
}

export default Table

interface IProps {
   pageIndex: number
   canNextPage: boolean
   pageOptions: number[]
   canPreviousPage: boolean
   switchPage: (page: number) => void
}

const Pagination = (props: IProps): JSX.Element => {
   const { pageIndex, switchPage, pageOptions, canNextPage, canPreviousPage } =
      props
   return (
      <Styles.Pagination>
         <aside>
            <Styles.Button.Icon
               disabled={!canPreviousPage}
               onClick={() => canPreviousPage && switchPage(0)}
            >
               <Icon.ChevronsLeft size={16} />
            </Styles.Button.Icon>
            <Styles.Button.Icon
               disabled={!canPreviousPage}
               onClick={() => canPreviousPage && switchPage(pageIndex - 1)}
            >
               <Icon.ChevronLeft size={16} />
            </Styles.Button.Icon>
         </aside>
         <span>
            Page {pageIndex + 1} of{' '}
            {pageOptions.length === 0 ? 1 : pageOptions.length}
         </span>
         <aside>
            <Styles.Button.Icon
               disabled={!canNextPage}
               onClick={() => canNextPage && switchPage(pageIndex + 1)}
            >
               <Icon.ChevronRight size={16} />
            </Styles.Button.Icon>
            <Styles.Button.Icon
               disabled={!canNextPage}
               onClick={() => canNextPage && switchPage(pageOptions.length - 1)}
            >
               <Icon.ChevronsRight size={16} />
            </Styles.Button.Icon>
         </aside>
      </Styles.Pagination>
   )
}

const Styles = {
   Container: styled('div', { ...tw`overflow-x-auto my-3` }),
   Amount: styled('span', {
      ...tw`font-mono`,
      variants: {
         is_expense: {
            true: { ...tw`text-red-400` },
            false: { ...tw`text-indigo-400` },
         },
      },
   }),
   Pagination: styled('section', {
      ...tw`flex items-center justify-center`,
      aside: { ...tw`flex items-center` },
      span: { ...tw`px-3 text-sm text-gray-400` },
      '@media (max-width:768px)': { ...tw`justify-between` },
   }),
   Button: {
      Icon: styled('button', {
         ...tw`border border-dark-200 h-10 w-10 flex items-center justify-center hover:bg-dark-300`,
         '+ button': { ...tw`ml-[-1px]` },
         svg: { ...tw`stroke-current text-gray-400` },
         variants: {
            disabled: {
               true: {
                  ...tw`opacity-50 cursor-not-allowed hover:bg-transparent`,
               },
            },
         },
      }),
   },
}
