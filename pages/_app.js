import GlobalStyles from '../styles/global'

const App = ({ Component, pageProps }) => (
   <>
      <GlobalStyles />
      <Component {...pageProps} />
   </>
)

export default App
