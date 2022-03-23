import { auth } from '../lib/supabase'
import { useUser } from '../lib/user'

export default function Home() {
   const { user } = useUser()
   return (
      <>
         {user?.id ? (
            <button onClick={auth.signout}>Logout</button>
         ) : (
            <button onClick={auth.signin}>Login</button>
         )}
      </>
   )
}
