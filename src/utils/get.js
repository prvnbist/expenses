const { default: supabase } = require('@/lib/supabase')

export const get = async ({ table = '', columns = '*', limit = 10, offset = 0, order = [], filters = [] }) => {
   try {
      const query = supabase.from(table).select(columns)

      filters.forEach(({ column = '', operator = 'eq', value = null, values = [] }) => {
         if (!column) return

         if (operator === 'eq') query.eq(column, value)
         if (operator === 'gt') query.gt(column, value)
         if (operator === 'lt') query.lt(column, value)
         if (operator === 'gte') query.gte(column, value)
         if (operator === 'lte') query.lte(column, value)
         if (operator === 'like') query.like(column, `%${value}%`)
         if (operator === 'ilike') query.ilike(column, `%${value}%`)
         if (operator === 'is') query.is(column, value)
         if (operator === 'in') query.in(column, values)
         if (operator === 'neq') query.neq(column, value)
      })

      if (limit) {
         query.range(offset || 0, limit - 1)
      }

      order.forEach(({ key, direction }) => {
         query.order(key, { ascending: direction === 'asc' })
      })

      let { data = [], error = null } = await query

      return { data, error }
   } catch (error) {
      return { data: [], error }
   }
}
