export type Transaction = {
   id: string
   type: string
   date: string
   title: string
   amount: number
   user_id: string | null
   group: string | null
   group_id: string | null
   account: string | null
   account_id: string | null
   category: string | null
   category_id: string | null
   payment_method: string | null
   payment_method_id: string | null
   actions?: null
}

export type Entity = Transaction
