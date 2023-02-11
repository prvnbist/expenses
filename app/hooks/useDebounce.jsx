import { useEffect, useState } from 'react'

function useDebounce(value, delay) {
   let [isDebouncing, setDebouncing] = useState(false)
   const [debouncedValue, setDebouncedValue] = useState(value)

   useEffect(() => {
      setDebouncing(true)
      const handler = setTimeout(() => {
         setDebouncing(false)
         setDebouncedValue(value)
      }, delay)
      return () => {
         clearTimeout(handler)
      }
   }, [value, delay])

   return [debouncedValue, isDebouncing]
}

export { useDebounce }
