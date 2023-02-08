'use client'
import { get } from '@/utils'
import { useState, useEffect, useCallback } from 'react'

export const useQuery = ({ table = '', columns = '*', limit = 10, offset = 0, order = [] }) => {
   const [data, setData] = useState([])
   const [error, setError] = useState(null)
   const [status, setStatus] = useState('IDLE')
   const [_limit] = useState(limit)
   const [_offset] = useState(offset)
   const [_order] = useState(order)

   const fetch = useCallback(async (__limit, __offset, __order) => {
      setStatus('LOADING')

      const { error = null, data = [] } = await get({
         table,
         columns,
         limit: __limit,
         offset: __offset,
         order: __order,
      })

      if (error) {
         setError(error)
         setStatus('ERROR')
      } else {
         if (data.length === 0) {
            setData([])
            setStatus('EMPTY')
         }

         setData(data)
         setStatus('SUCCESS')
      }
   }, [])

   useEffect(() => {
      ;(async () => {
         await fetch(_limit, _offset, _order)
      })()
   }, [_limit, _offset, _order])

   return { status, error, data }
}
