import { useRouter } from 'next/router'

import magic from '../lib/magic'

export default function Login() {
   const router = useRouter()
   const handleSubmit = async event => {
      event.preventDefault()

      const { elements } = event.target

      const did = await magic.auth.loginWithMagicLink({
         email: elements.email.value,
      })

      const authRequest = await fetch('/api/login', {
         method: 'POST',
         headers: { Authorization: `Bearer ${did}` },
      })

      if (authRequest.ok) {
         router.push('/transactions')
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
