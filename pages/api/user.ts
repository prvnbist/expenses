import Iron from '@hapi/iron'
import type { NextApiRequest, NextApiResponse } from 'next'

import CookieService from '../../lib/cookie'

const User = async (req: NextApiRequest, res: NextApiResponse) => {
   let user
   try {
      user = await Iron.unseal(
         CookieService.getAuthToken(req.cookies),
         process.env.NEXT_MAGIC_ENCRYPTION_KEY || '',
         Iron.defaults
      )
   } catch (error) {
      res.status(401).end()
   }

   res.json(user)
}

export default User
