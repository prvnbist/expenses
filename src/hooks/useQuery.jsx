'use client'
import { get } from '@/utils'
import { useState, useEffect, useCallback } from 'react'

export const useQuery = ({ table = '', columns = '*', limit = 10, offset = 0, order = [] }) => {
   const [data, setData] = useState([])
   const [error, setError] = useState(null)
   const [status, setStatus] = useState('IDLE')

   const fetch = useCallback(async (_limit, _offset, _order) => {
      setStatus('LOADING')

      const { error = null, data = [] } = await get({
         table,
         columns,
         limit: _limit,
         offset: _offset,
         order: _order,
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
         await fetch(limit, offset, order)
      })()
   }, [])

   return { status, error, data }
}
