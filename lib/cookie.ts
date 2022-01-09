import { serialize } from 'cookie'

const TOKEN_NAME = 'api_token'
const MAX_AGE = 60 * 60 * 8

function createCookie(name: any, data: any, options = {}) {
   return serialize(name, data, {
      maxAge: MAX_AGE,
      expires: new Date(Date.now() + MAX_AGE * 1000),
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      ...options,
   })
}

function setTokenCookie(res: any, token: any) {
   res.setHeader('Set-Cookie', [
      createCookie(TOKEN_NAME, token),
      createCookie('authed', true, { httpOnly: false }),
   ])
}

function getAuthToken(cookies: any) {
   return cookies[TOKEN_NAME]
}

const exportObject = { setTokenCookie, getAuthToken }

export default exportObject
