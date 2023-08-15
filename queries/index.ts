import dayjs from 'dayjs'

import supabase from '@/libs/supabase'
import type { Entities, TransactionRow, TransactionType } from '@/types'

export type Sort = {
   value: string
   direction: 'ASC' | 'DESC'
}

export type TransactionArgs = {
   limit?: number
   sorts: Sort[]
   page: number
   categories: string[]
   accounts: string[]
   paymentMethods: string[]
   type: 'all' | TransactionType
}

export const transactions = async ({
   sorts = [],
   limit = 10,
   page = 1,
   type = 'all',
   categories = [],
   accounts = [],
   paymentMethods = [],
}: TransactionArgs) => {
   const query = supabase.from('transactions').select('*')

   if (categories.length > 0) {
      query.in('category_id', categories)
   }

   if (accounts.length > 0) {
      query.in('account_id', accounts)
   }

   if (paymentMethods.length > 0) {
      query.in('payment_method_id', paymentMethods)
   }

   if (type !== 'all') {
      query.eq('type', type)
   }

   if (sorts.length > 0) {
      sorts.forEach(item => query.order(item.value, { ascending: item.direction === 'ASC' }))
   }

   query.range((page - 1) * limit, page * limit - 1)

   return await query
}

export const transactionsTotal = async ({
   type = 'all',
   categories = [],
   accounts = [],
   paymentMethods = [],
}: {
   categories: string[]
   accounts: string[]
   paymentMethods: string[]
   type: 'all' | TransactionType
}) => {
   const query = supabase.from('transactions').select('*', { count: 'exact', head: true })

   if (categories.length > 0) {
      query.in('category_id', categories)
   }

   if (accounts.length > 0) {
      query.in('account_id', accounts)
   }

   if (paymentMethods.length > 0) {
      query.in('payment_method_id', paymentMethods)
   }

   if (type !== 'all') {
      query.eq('type', type)
   }

   const { count, error } = await query
   return { count, error }
}

export const transaction = async ({ id }: { id: string }) => {
   const { data, error } = await supabase.from('transactions').select('*').eq('public_id', id)
   if (!data || data?.length === 0) {
      return { data: null, error }
   }
   return { data: data[0], error }
}

export const allEntities = async () => {
   const { data, error } = await supabase.rpc('entities')

   const results =
      data.length > 0
         ? Object.fromEntries(
              data.map((datum: any) => [
                 datum.title,
                 (datum.list ?? []).map((item: any) => ({
                    value: item.id,
                    label: item.title,
                    ...(item.type && { group: item.type }),
                 })),
              ])
           )
         : { categories: [], payment_methods: [], accounts: [], groups: [] }

   return { data: results as Entities, error }
}

export const upsertTransaction = async (values: TransactionRow) => {
   const row = [{ ...values, date: dayjs(values.date).format('YYYY-MM-DD'), amount: Math.ceil(values.amount * 100) }]

   const { data, error } = await supabase.from('transaction').upsert(row).select()

   return { data, error }
}

export const addTransactions = async (items: TransactionRow[]) => {
   const rows = items.map(item => {
      const _item = { ...item }
      if (!_item.account_id) delete _item.account_id
      if (!_item.category_id) delete _item.category_id
      if (!_item.payment_method_id) delete _item.payment_method_id
      return {
         ..._item,
         date: dayjs(_item.date).format('YYYY-MM-DD'),
         amount: Math.ceil(_item.amount * 100),
      }
   })

   const { data, error } = await supabase.from('transaction').insert(rows).select()

   return { data, error }
}

export const deleteTransaction = async (id: string) => {
   const { error } = await supabase.from('transaction').delete().eq('id', id)
   return { error }
}
