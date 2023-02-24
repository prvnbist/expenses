import { useEffect } from 'react'
import { json } from '@remix-run/node'
import { IconLoader2 } from '@tabler/icons-react'
import { useActionData, Form, useTransition, useNavigate } from '@remix-run/react'

import styles from '~/styles/login.css'

export const meta = () => ({
   charset: 'utf-8',
   title: 'Login | Kharcha App',
})

export function links() {
   return [{ rel: 'stylesheet', href: styles }]
}

export async function action({ request }) {
   const data = await request.formData()
   const { password = '' } = Object.fromEntries(data)

   if (password.trim() !== process.env.PASSWORD) {
      return json({ status: 'ERROR', error: 'INCORRECT_CREDENTIALS', password })
   }

   return json({ status: 'SUCCESS', password })
}

export default function Login() {
   const data = useActionData()
   const navigate = useNavigate()
   const transition = useTransition()

   useEffect(() => {
      if (data?.status === 'SUCCESS') {
         localStorage.setItem('password', data?.password)
         navigate('/')
      }
   }, [data])

   return (
      <div className="container">
         <div className="card">
            <h2 className="heading2">Login</h2>
            <div className="spacer-md" />
            <Form method="post" action="/login">
               <label className="form__label">Password</label>
               <div className="spacer-2xs" />
               <input
                  name="password"
                  type="password"
                  className="form__input"
                  placeholder="Enter the password"
                  defaultValue={data?.password || ''}
               />
               <div className="spacer-sm" />
               <button type="submit" className="form__button wide success" disabled={transition.state === 'submitting'}>
                  {transition.state === 'submitting' && (
                     <>
                        <IconLoader2 size={16} className="rotate" />
                        <div className="spacer-2xs" />
                     </>
                  )}
                  LET ME IN
               </button>
               <div className="spacer-xs" />
               {data?.error === 'INCORRECT_CREDENTIALS' && (
                  <span className="form__error">Please enter the correct credentials</span>
               )}
            </Form>
         </div>
      </div>
   )
}
