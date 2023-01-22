const { default: supabase } = require('@/lib/supabase')

export const get = async ({ table = '', columns = '', limit = 10, offset = 0, order = [] }) => {
   try {
      const query = supabase.from(table).select(columns)

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
