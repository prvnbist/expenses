import { createGlobalStyle } from 'styled-components'
import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro'

const CustomStyles = createGlobalStyle`
   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
   * {
      box-sizing: border-box;
      font-family: 'Inter', sans-serif;
   }
   body {
      color: #fff;
      margin: 16px;
      background: #1F2937;
   }
`

const GlobalStyles = () => (
   <>
      <BaseStyles />
      <CustomStyles />
   </>
)

export default GlobalStyles
