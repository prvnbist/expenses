import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
   process.env.NEXT_SUPABASE_URL || '',
   process.env.NEXT_SUPABASE_PUBLIC_KEY || ''
)

export const auth = {
   signin: async () => {
      await supabase.auth.signIn({ provider: 'google' })
   },
   signout: async () => {
      await supabase.auth.signOut()
   },
}

export default supabase
