import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { ToastProvider } from 'react-toast-notifications'

import 'styles/globals.css'
import client from 'lib/apollo'
import { UserProvider } from 'lib/user'
import globalStyles from 'styles/globalStyles'
import { SettingProvider } from 'lib/settings'

const App = ({ Component, pageProps }: AppProps) => {
   globalStyles()
   return (
      <ToastProvider
         autoDismiss
         placement="top-center"
         autoDismissTimeout={3000}
      >
         <ApolloProvider client={client}>
            <UserProvider>
               <SettingProvider>
                  <Component {...pageProps} />
               </SettingProvider>
            </UserProvider>
         </ApolloProvider>
      </ToastProvider>
   )
}

export default App
