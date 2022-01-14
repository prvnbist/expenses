import React from 'react'

export const useDebounce = (value: string, delay: number, cb: () => void) => {
   const [debouncedValue, setDebouncedValue] = React.useState(value)
   React.useEffect(() => {
      const handler = setTimeout(() => {
         setDebouncedValue(value)
         cb()
      }, delay)
      return () => {
         clearTimeout(handler)
      }
   }, [value, delay, cb])
   return debouncedValue
}
