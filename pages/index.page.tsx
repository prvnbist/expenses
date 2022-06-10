import React from 'react'
import Link from 'next/link'
import tw, { styled } from 'twin.macro'

import * as Icon from 'icons'
import { Loader } from 'components'
import { auth } from 'lib/supabase'
import { useUser } from 'lib/user'

export default function Home() {
   const [hasLoginError, setHasLoginError] = React.useState(false)
   const { user, isLoggingIn, setIsLoggingIn } = useUser()

   const signInUser = async () => {
      setIsLoggingIn(true)
      setHasLoginError(false)
      const result = await auth.signin()
      if (result?.error) {
         setIsLoggingIn(false)
         setHasLoginError(true)
      }
   }
   return (
      <Styles.Fold>
         <Styles.Header>
            <section>
               <Styles.PageHeading>
                  Manage your expenses effortlessly
               </Styles.PageHeading>
               <Styles.PageSubHeading>
                  An all in one solution to track your expenditure with easy
                  interface and informative analytics.
               </Styles.PageSubHeading>
               {!user?.id && (
                  <Styles.Google onClick={signInUser} disabled={isLoggingIn}>
                     {isLoggingIn ? (
                        <Loader />
                     ) : (
                        <>
                           <span tw="mr-2">
                              <Icon.Google tw="stroke-current" />
                           </span>
                           Login with Google
                        </>
                     )}
                  </Styles.Google>
               )}
               {user?.id && (
                  <Link href="/dashboard" passHref>
                     <a tw="bg-[#4285F4] flex flex-shrink-0 items-center h-12 w-auto px-6 rounded-md text-white">
                        Go to Dashboard
                     </a>
                  </Link>
               )}
               {hasLoginError && (
                  <span tw="mt-3 text-red-400">
                     Something went wrong, please login again!
                  </span>
               )}
            </section>
         </Styles.Header>
      </Styles.Fold>
   )
}

const Styles = {
   Fold: styled.section({
      ...tw`bg-dark-400 h-screen flex flex-col relative overflow-hidden`,
   }),
   Header: styled.header({
      maxWidth: '1180px',
      width: 'calc(100% - 32px)',
      ...tw`text-center flex pb-4 flex-1 mx-auto flex-col items-start justify-center`,
      section: {
         maxWidth: '540px',
         ...tw`mx-auto w-full flex flex-col items-center`,
      },
      '@tablet': {
         ...tw`px-4`,
      },
   }),
   PageHeading: styled.h1({
      background: 'linear-gradient(93.02deg, #4285F4 0.74%, #FFD075 94.25%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textFillColor: 'transparent',
      ...tw`text-5xl font-bold font-heading mb-1 leading-[56px]`,
      '@tablet': {
         ...tw`text-4xl`,
      },
   }),
   PageSubHeading: styled.p({
      ...tw`text-gray-500 text-xl mb-5`,
   }),
   Google: styled.button({
      backgroundColor: '#4285F4',
      ...tw`flex flex-shrink-0 items-center h-12 w-auto px-6 rounded-md text-white`,
      width: '210.55px',
      '&:hover': {
         backgroundColor: '#3e7ee4',
      },
      '&[disabled]': {
         backgroundColor: '#3e7ee4',
         ...tw`cursor-not-allowed`,
      },
   }),
}
