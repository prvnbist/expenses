import Iron from '@hapi/iron'
import { Magic } from '@magic-sdk/admin'
import { GraphQLClient } from 'graphql-request'
import type { NextApiRequest, NextApiResponse } from 'next'

import CookieService from '../../lib/cookie'

const client = new GraphQLClient(process.env.NEXT_HASURA_ENDPOINT, {
   headers: { 'x-hasura-admin-secret': process.env.NEXT_HASURA_ADMIN_SECRET },
})

const UPSERT_USER = `
   mutation upsert_user($object: user_insert_input = {}) {
      upsert_user: insert_user(
         object: $object
         on_conflict: {
            constraint: user_email_key
            update_columns: [username, email]
         }
      ) {
         id
         username
      }
   }
`

const Login = async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method !== 'POST') return res.status(405).end()

   let did = ''
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
   ) {
      did = req.headers.authorization.split('Bearer')?.pop()?.trim() ?? ''
   }
   const user = await new Magic(
      process.env.NEXT_MAGIC_SECRET_KEY
   ).users.getMetadataByToken(did)

   const token = await Iron.seal(
      user,
      process.env.NEXT_MAGIC_ENCRYPTION_KEY || '',
      Iron.defaults
   )
   await client.request(UPSERT_USER, {
      object: {
         email: user.email,
         username: user?.email?.split('@')[0] ?? '',
      },
   })
   CookieService.setTokenCookie(res, token)

   res.end()
}

export default Login
