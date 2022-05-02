import React from 'react'
import tw, { styled } from 'twin.macro'

import * as Icon from 'icons'
import { Loader } from 'components'
import { auth } from 'lib/supabase'
import { useUser } from 'lib/user'
import styles from 'styles/globalStyles'

export default function Home() {
   const { user } = useUser()
   const [isSigningIn, setIsSigningIn] = React.useState(false)

   const signInUser = async () => {
      setIsSigningIn(true)
      const { error = null } = await auth.signin()
      if (error) {
         setIsSigningIn(false)
      }
   }
   return (
      <Styles.Fold>
         <Styles.Nav>
            <Styles.Brand>
               <span>Kharcha</span>
            </Styles.Brand>
         </Styles.Nav>
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
                  <Styles.Google onClick={signInUser} disabled={isSigningIn}>
                     {isSigningIn ? (
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
            </section>
         </Styles.Header>
         <Styles.Illo />
      </Styles.Fold>
   )
}

const Styles = {
   Fold: styled.section({
      ...tw`h-screen flex flex-col relative overflow-hidden`,
   }),
   Nav: styled.nav({
      maxWidth: '1180px',
      ...tw`w-full mx-auto h-12 flex items-center`,
      '@tablet': {
         ...tw`px-4`,
      },
   }),
   Brand: styled.section({
      ...tw`font-heading font-extrabold text-2xl`,
      background: 'linear-gradient(92.79deg, #CE6D4E 1.39%, #82E931 74.71%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textFillColor: 'transparent',
   }),
   Header: styled.header({
      maxWidth: '1180px',
      ...tw`flex pb-4 w-full flex-1 mx-auto flex-col items-start justify-center`,
      section: {
         maxWidth: '540px',
         ...tw`w-full`,
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
      color: '#5A6872',
      ...tw`text-xl mb-5`,
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
   Illo: styled.span({
      position: 'absolute',
      top: '0',
      right: '-60%',
      border: '0',
      width: '100%',
      height: '100%',
      background: '#FFD075',
      transform: 'skew(332deg)',
      zIndex: -1,
      '@tablet': {
         right: '-132%',
         transform: 'skew(306deg)',
      },
   }),
}
