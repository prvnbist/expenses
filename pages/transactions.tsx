import { useRouter } from 'next/router'

import magic from '../lib/magic'
import useAuth from '../hooks/useAuth'

export default function Dashboard() {
   const { user, loading } = useAuth()
   const router = useRouter()

   const logout = () => {
      magic.user.logout().then(() => {
         router.push('/login')
      })
   }

   return (
      <>
         <h1>Dashboard</h1>
         {loading ? 'Loading...' : user.email}
         <button onClick={logout}>Logout</button>
      </>
   )
}
