import React from 'react'
import { useRouter } from 'next/router'

export default () => {
   const router = useRouter()

   React.useEffect(() => {
      router.push('/expenses')
   }, [])

   return <div></div>
}
