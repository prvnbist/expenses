'use client'
import supabase from '@/lib/supabase'
import { useState, useEffect } from 'react'

export const useQuery = ({ table = '', columns = '*', limit = 10, offset = 0 }) => {
   const [data, setData] = useState([])
   const [error, setError] = useState(null)
   const [status, setStatus] = useState('IDLE')
   useEffect(() => {
      if (!table) return
      ;(async () => {
         setStatus('LOADING')
         const query = supabase.from(table).select(columns)

         if (limit) {
            query.range(offset || 0, limit - 1)
         }

         let { data, error } = await query

         if (error) {
            setError(error)
            setStatus('ERROR')
            return
         }

         if (data.length === 0) {
            setData([])
            setStatus('EMPTY')
            return
         }

         setData(data)
         setStatus('SUCCESS')
      })()
   }, [table, columns, limit, offset])

   return { status, error, data }
}
