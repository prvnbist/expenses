import React from 'react'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useSubscription } from '@apollo/client'

import {
   TRANSACTIONS,
   DELETE_TRANSACTION,
   DELETE_TRANSACTIONS,
   TRANSACTIONS_AGGREGATE,
} from '../graphql'

const Context = React.createContext()

export const TransactionsProvider = ({ children }) => {
   const { addToast } = useToasts()
   const [where, setWhere] = React.useState({})
   const [limit, setLimit] = React.useState(10)
   const [offset, setOffset] = React.useState(0)
   const [editForm, setEditForm] = React.useState({})
   const [selected, setSelected] = React.useState([])
   const [isFormOpen, setIsFormOpen] = React.useState(false)
   const [orderBy] = React.useState({
      title: 'asc',
      raw_date: 'desc',
   })

   const {
      loading: loading_aggregate,
      data: { transactions_aggregate = {} } = {},
   } = useSubscription(TRANSACTIONS_AGGREGATE, {
      variables: {
         where: { ...where },
      },
   })
   const { loading, data: { transactions = [] } = {} } = useSubscription(
      TRANSACTIONS,
      {
         variables: {
            limit,
            where: { ...where },
            offset,
            order_by: orderBy,
         },
      }
   )

   const [remove] = useMutation(DELETE_TRANSACTION, {
      onCompleted: () =>
         addToast('Successfully deleted the transaction.', {
            appearance: 'success',
         }),
      onError: error => {
         console.log('delete -> error ->', error)
         addToast('Failed to delete the transaction.', { appearance: 'error' })
      },
   })
   const [removeMultiple] = useMutation(DELETE_TRANSACTIONS, {
      onCompleted: () => {
         setSelected([])
         addToast('Successfully deleted the transactions.', {
            appearance: 'success',
         })
      },
      onError: () => {
         addToast('Failed to delete the transactions.', { appearance: 'error' })
      },
   })

   const update = transaction => {
      setEditForm(transaction)
      setIsFormOpen(true)
   }

   const onSearch = keyword => {
      setWhere(existing => ({
         ...existing,
         _or: [
            { title: { _ilike: `%${keyword}%` } },
            { account: { _ilike: `%${keyword}%` } },
            { payment_method: { _ilike: `%${keyword}%` } },
            { category: { _ilike: `%${keyword}%` } },
         ],
      }))
   }

   const on_row_select = React.useCallback(
      row => {
         if (selected.findIndex(node => node.id === row.id) !== -1) {
            setSelected(existing => [
               ...existing.filter(node => node.id !== row.id),
            ])
            return
         }
         setSelected(existing => [...existing, row])
      },
      [selected]
   )

   const is_row_selected = React.useCallback(
      row => selected.findIndex(node => node.id === row.id) !== -1,
      [selected]
   )

   const bulk = {
      reset: () => setSelected([]),
      delete: () => {
         if (selected.length === 0) return
         removeMultiple({
            variables: {
               where: { id: { _in: selected.map(node => node.id) } },
            },
         })
      },
   }

   return (
      <Context.Provider
         value={{
            bulk,
            where,
            offset,
            limit,
            orderBy,
            update,
            remove,
            editForm,
            onSearch,
            setLimit,
            selected,
            setWhere,
            setOffset,
            isFormOpen,
            setEditForm,
            setSelected,
            transactions,
            setIsFormOpen,
            on_row_select,
            is_row_selected,
            transactions_aggregate,
            is_loading: loading || loading_aggregate,
         }}
      >
         {children}
      </Context.Provider>
   )
}

export const useTransactions = () => React.useContext(Context)
