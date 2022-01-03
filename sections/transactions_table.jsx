import React from 'react'
import tw, { styled } from 'twin.macro'

import { useConfig } from '../context'
import * as Icon from '../assets/icons'
import * as Svg from '../assets/svgs'
import { Button, Loader, Table } from '../components'
import { useTransactions } from '../hooks/useTransactions'

export const TableView = ({ resetPage }) => {
   const { methods } = useConfig()
   const {
      setWhere,
      is_loading,
      setEditForm,
      transactions,
      setIsFormOpen,
      on_row_select,
      is_row_selected,
      transactions_aggregate,
   } = useTransactions()

   const viewBy = (key, value) => {
      if (!value) return
      setWhere(existing => ({
         ...existing,
         [key]: { _eq: value },
      }))
   }

   if (is_loading)
      return (
         <div tw="mt-4">
            <Loader />
         </div>
      )
   if (transactions_aggregate?.aggregate?.count === 0)
      return (
         <div tw="w-full flex items-center justify-center">
            <Svg.Empty message="No transactions yet!" />
         </div>
      )
   return (
      <Table>
         <Table.Head>
            <Table.Row>
               <Table.HCell></Table.HCell>
               <Table.HCell>Title</Table.HCell>
               <Table.HCell is_right>Amount</Table.HCell>
               <Table.HCell is_right>Date</Table.HCell>
               <Table.HCell>Category</Table.HCell>
               <Table.HCell>Payment Method</Table.HCell>
               <Table.HCell>Account</Table.HCell>
            </Table.Row>
         </Table.Head>
         <Table.Body>
            {transactions.map((transaction, index) => (
               <Table.Row key={transaction.id} odd={index % 2 === 0}>
                  <Table.Cell no_padding>
                     <Styles.Checkbox
                        is_selected={is_row_selected(transaction)}
                     >
                        <input
                           readOnly
                           type="checkbox"
                           id={`row__select__${index + 1}`}
                           name={`row__select__${index + 1}`}
                           checked={is_row_selected(transaction)}
                        />
                        <label
                           htmlFor={`row__select__${index + 1}`}
                           onClick={() => on_row_select(transaction)}
                        />
                     </Styles.Checkbox>
                  </Table.Cell>
                  <Table.Cell
                     on_hover
                     onClick={() => {
                        setIsFormOpen(true)
                        setEditForm(transaction)
                     }}
                  >
                     {transaction.title}
                  </Table.Cell>
                  <Table.Cell is_right>
                     <span
                        css={[
                           tw`font-medium`,
                           transaction.type === 'income'
                              ? tw`text-indigo-400`
                              : tw`text-red-400`,
                        ]}
                     >
                        {`${
                           transaction.type === 'income' ? '+ ' : '- '
                        } ${methods.format_currency(
                           Number(
                              transaction.type === 'income'
                                 ? transaction.credit
                                 : transaction.debit
                           )
                        )}`}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>{transaction.date}</Table.Cell>
                  <Table.Cell>
                     <Tag
                        title={transaction.category}
                        onClick={() => {
                           viewBy('category', transaction.category)
                           resetPage()
                        }}
                     >
                        {transaction.category}
                     </Tag>
                  </Table.Cell>
                  <Table.Cell>
                     <Tag
                        title={transaction.payment_method}
                        onClick={() => {
                           viewBy('payment_method', transaction.payment_method)
                           resetPage()
                        }}
                     >
                        {transaction.payment_method}
                     </Tag>
                  </Table.Cell>
                  <Table.Cell>
                     <Tag
                        title={transaction.account}
                        onClick={() => {
                           viewBy('account', transaction.account)
                           resetPage()
                        }}
                     >
                        {transaction.account}
                     </Tag>
                  </Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}

const Tag = tw.button`text-xs rounded px-[6px] bg-indigo-200 text-indigo-900 cursor-pointer font-bold focus:(bg-indigo-300)`

const Styles = {
   Checkbox: styled.span`
      ${tw`flex h-8 items-center justify-center`}
      input {
         opacity: 0;
         display: none;
         visibility: hidden;
      }
      label {
         ${tw`inline-flex h-4 w-4 rounded bg-dark-200 relative p-1 cursor-pointer`}
         :after {
            content: '';
            position: absolute;
            ${tw`h-2 w-2 rounded`}
            ${({ is_selected }) => is_selected && tw`bg-white`}
         }
      }
   `,
}
