import React from 'react'
import tw from 'twin.macro'
import Dinero from 'dinero.js'
import { styled } from '@stitches/react'
import { useTable, usePagination } from 'react-table'

import * as Icon from '../../../../icons'
import { Table as MyTable } from '../../../../components'

interface ITransaction {
   id: string
   type: string
   date: string
   title: string
   amount: number
   raw_date: string
}
interface ITableProps {
   transactions: ITransaction[]
   pagination: {
      page: number
      size: number
      count: number
   }
   onPageChange: (input: number) => void
}

const Table = ({
   transactions = [],
   pagination,
   onPageChange,
}: ITableProps): JSX.Element => {
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
            pageSize: pagination.size,
            pageIndex: pagination.page,
         },
      },
      usePagination
   )

   const switchPage = page => {
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
                  {headerGroups.map(headerGroup => (
                     <MyTable.Row {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                           return (
                              <MyTable.HCell
                                 {...column.getHeaderProps()}
                                 is_right={column.alignment === 'right'}
                              >
                                 {column.render('Header')}
                              </MyTable.HCell>
                           )
                        })}
                     </MyTable.Row>
                  ))}
               </MyTable.Head>
               <MyTable.Body {...getTableBodyProps()}>
                  {page.map((row, i) => {
                     prepareRow(row)
                     return (
                        <Row
                           {...row.getRowProps()}
                           row={row}
                           isOdd={i % 2 !== 0}
                        />
                     )
                  })}
               </MyTable.Body>
            </MyTable>
            {transactions.length === 0 && (
               <Styles.Empty>No transactions yet!</Styles.Empty>
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

const Row = ({ row, isOdd, ...props }: any) => {
   return (
      <MyTable.Row {...props} odd={!isOdd}>
         {row.cells.map(cell => {
            return <Cell {...cell.getCellProps()} cell={cell} />
         })}
      </MyTable.Row>
   )
}

const Cell = ({ cell, ...props }: any) => {
   return (
      <MyTable.Cell
         {...props}
         is_right={cell.column.alignment === 'right'}
         {...(cell.column.id !== 'title' && {
            width: cell.column.width,
         })}
      >
         {cell.render('Cell')}
      </MyTable.Cell>
   )
}

const Pagination = props => {
   const { pageIndex, switchPage, pageOptions, canNextPage, canPreviousPage } =
      props
   return (
      <Styles.Pagination>
         <aside>
            <Styles.Button.Icon
               disabled={!canPreviousPage}
               onClick={() => switchPage(0)}
            >
               <Icon.ChevronsLeft size={16} />
            </Styles.Button.Icon>
            <Styles.Button.Icon
               disabled={!canPreviousPage}
               onClick={() => switchPage(pageIndex - 1)}
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
               onClick={() => switchPage(pageIndex + 1)}
            >
               <Icon.ChevronRight size={16} />
            </Styles.Button.Icon>
            <Styles.Button.Icon
               disabled={!canNextPage}
               onClick={() => switchPage(pageOptions.length - 1)}
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
   Empty: styled('p', { ...tw`text-gray-500 py-4 text-lg text-center` }),
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
      }),
   },
}
