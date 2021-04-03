import tw from 'twin.macro'

import Header from './header'

export const Layout = ({ children }) => {
   return (
      <section>
         <Header />
         <main tw="p-4">{children}</main>
      </section>
   )
}
