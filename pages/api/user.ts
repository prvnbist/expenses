import Iron from '@hapi/iron'
import { GraphQLClient } from 'graphql-request'
import type { NextApiRequest, NextApiResponse } from 'next'

import CookieService from '../../lib/cookie'

const client = new GraphQLClient(process.env.NEXT_HASURA_ENDPOINT, {
   headers: { 'x-hasura-admin-secret': process.env.NEXT_HASURA_ADMIN_SECRET },
})

const USERS = `
   query users($where: user_bool_exp = {}) {
      users(where: $where) {
         id
      }
   }
`

const User = async (req: NextApiRequest, res: NextApiResponse) => {
   let user
   try {
      user = await Iron.unseal(
         CookieService.getAuthToken(req.cookies),
         process.env.NEXT_MAGIC_ENCRYPTION_KEY || '',
         Iron.defaults
      )
      const { users = [] } = await client.request(USERS, {
         where: { email: { _eq: user.email } },
      })
      if (users.length > 0) {
         user = { ...user, id: users[0].id }
      }
   } catch (error) {
      res.status(401).end()
   }

   res.json(user)
}

export default User
