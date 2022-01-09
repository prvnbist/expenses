import { useRouter } from 'next/router'

import { logout } from '../lib/magic'
import useAuth from '../hooks/useAuth'

export default function Dashboard() {
   const { user, loading } = useAuth()
   const router = useRouter()

   return (
      <>
         <h1>Dashboard</h1>
         {loading ? 'Loading...' : user.email}
         <button onClick={() => logout(() => router.push('/login'))}>
            Logout
         </button>
      </>
   )
}
