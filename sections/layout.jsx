import tw, { styled } from 'twin.macro'

import Header from './header'

export const Layout = ({ noPadding = false, children }) => {
   return (
      <Section>
         <Header />
         <main css={[!noPadding && tw`p-4`]}>{children}</main>
      </Section>
   )
}

const Section = styled.section`
   * {
      ${tw`ring-indigo-500 ring-offset-2 ring-offset-gray-800 focus:(outline-none bg-gray-600 ring ring-1)`}
   }
`
