import React from 'react'
import tw from 'twin.macro'
import Dinero from 'dinero.js'
import { styled } from '@stitches/react'
import { useTable } from 'react-table'

import { Table as MyTable } from '../../../components'

const Table = ({ transactions = [] }) => {
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
                     {type === 'expense' ? '- ' : '+ '}
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
      ],
      []
   )

   const { prepareRow, headerGroups, getTableProps, getTableBodyProps, rows } =
      useTable({
         columns,
         data: transactions,
         initialState: {},
      })
   return (
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
               {rows.map((row, i) => {
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

const Styles = {
   Container: styled('div', { ...tw`overflow-x-auto` }),
   Amount: styled('span', {
      variants: {
         is_expense: {
            true: { ...tw`text-red-500` },
            false: { ...tw`text-indigo-500` },
         },
      },
   }),
   Empty: styled('p', { ...tw`py-4 text-lg text-center` }),
}
