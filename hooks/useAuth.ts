import useSWR from 'swr'

import { IUser } from '../lib/user'

function fetcher(route: string) {
   return fetch(route)
      .then(r => r.ok && r.json())
      .then(user => user || null)
}

export default function useAuth() {
   // const { data: user, error } = useSWR('/api/user', fetcher)
   let user: IUser = {
      issuer: 'did:ethr:0xe81197FB3CfCDdb3b65259Ba10843632D70d52F1',
      publicAddress: '0xe81197FB3CfCDdb3b65259Ba10843632D70d52F1',
      email: 'prvnbist@gmail.com',
      oauthProvider: null,
      phoneNumber: null,
      id: 'da1db57f-29fb-44ea-a857-7ab98c4077c5',
      username: 'prvnbist',
   }
   const loading = user === undefined

   return {
      user,
      loading,
      error: '',
   }
}
