import React from 'react'

export const useDebounce = (value: string, delay: number, cb) => {
   const [debouncedValue, setDebouncedValue] = React.useState(value)
   React.useEffect(() => {
      const handler = setTimeout(() => {
         setDebouncedValue(value)
         cb()
      }, delay)
      return () => {
         clearTimeout(handler)
      }
   }, [value, delay])
   return debouncedValue
}
