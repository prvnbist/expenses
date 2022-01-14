import React from 'react'
import { useRouter } from 'next/router'

import magic from '../lib/magic'
import useAuth from '../hooks/useAuth'

export default function Login() {
   const router = useRouter()
   const { user, loading } = useAuth()

   React.useEffect(() => {
      if (!loading && user?.username) {
         router.push(`${user?.username}/transactions`)
      }
   }, [loading, user, router])

   const handleSubmit = async (event: React.SyntheticEvent) => {
      event.preventDefault()

      const { elements } = event.target as typeof event.target & {
         elements: { email: { value: string } }
      }

      const did = await magic.auth.loginWithMagicLink({
         email: elements.email.value,
      })

      const authRequest = await fetch('/api/login', {
         method: 'POST',
         headers: { Authorization: `Bearer ${did}` },
      })

      const user = await fetch('/api/user')
         .then(r => r.ok && r.json())
         .then(user => user || null)

      if (authRequest.ok && user?.username) {
         router.push(`${user?.username}/transactions`)
      } else {
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <label htmlFor="email">Email</label>
         <input name="email" type="email" />
         <button>Log in</button>
      </form>
   )
}
