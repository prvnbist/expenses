import useSWR from 'swr'

import { IUser } from '../lib/user'

function fetcher(route: string) {
   return fetch(route)
      .then(r => r.ok && r.json())
      .then(user => user || null)
}

export default function useAuth() {
   const { data: user, error } = useSWR('/api/user', fetcher)
   const loading = user === undefined

   return {
      user,
      loading,
      error: '',
   }
}
