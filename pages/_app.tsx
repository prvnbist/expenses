import { AppProps } from 'next/app'
import globalStyles from '../styles/globalStyles'

import '../styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => {
   globalStyles()
   return <Component {...pageProps} />
}

export default App
