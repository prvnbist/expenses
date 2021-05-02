import React from 'react'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useSubscription } from '@apollo/client'

import {
   TRANSACTIONS,
   DELETE_TRANSACTION,
   TRANSACTIONS_AGGREGATE,
} from '../graphql'

const Context = React.createContext()

export const TransactionsProvider = ({ children }) => {
   const { addToast } = useToasts()
   const [editForm, setEditForm] = React.useState({})
   const [isFormOpen, setIsFormOpen] = React.useState(false)
   const [offset, setOffset] = React.useState(0)
   const [limit, setLimit] = React.useState(10)
   const [where, setWhere] = React.useState({})
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

   return (
      <Context.Provider
         value={{
            where,
            offset,
            limit,
            orderBy,
            update,
            remove,
            editForm,
            onSearch,
            setLimit,
            setWhere,
            setOffset,
            isFormOpen,
            setEditForm,
            transactions,
            setIsFormOpen,
            transactions_aggregate,
            is_loading: loading || loading_aggregate,
         }}
      >
         {children}
      </Context.Provider>
   )
}

export const useTransactions = () => React.useContext(Context)
