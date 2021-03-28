import tw from 'twin.macro'

export const Button = {
   Group: ({ children }) => <Styles.Group>{children}</Styles.Group>,
   Icon: ({ children }) => <Styles.Icon>{children}</Styles.Icon>,
}

const Styles = {
   Group: tw.section`flex flex-wrap items-center gap-3`,
   Icon: tw.button`h-10 w-10 flex flex-shrink-0 items-center justify-center rounded-lg bg-gray-700 hover:(bg-gray-600)`,
}
