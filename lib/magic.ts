import { Magic } from 'magic-sdk'

const magic = new Magic(process.env.NEXT_MAGIC_PUBLISHABLE_KEY)

export const logout = (cb: any) => {
   magic.user.logout().then(() => {
      cb()
   })
}

export default magic
