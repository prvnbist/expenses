import tw from 'twin.macro'

const typePicker = type => {
   switch (type) {
      case 'expenses':
         return [tw`bg-red-400`, tw`text-red-800`]
      case 'earnings':
         return [tw`bg-indigo-400`, tw`text-indigo-800`]
      case 'neutral':
         return [tw`bg-gray-400`, tw`text-gray-600`]
      default:
         return [tw`bg-red-400`, tw`text-red-800`]
   }
}

export const Stat = ({ type, label, children }) => {
   return (
      <main
         style={{ minWidth: '220px' }}
         css={[tw`flex flex-col p-3 rounded-lg`, typePicker(type)[0]]}
      >
         <h3
            css={[
               tw`text-sm font-bold sm:font-normal sm:text-base uppercase tracking-wider`,
               typePicker(type)[1],
            ]}
         >
            {label}
         </h3>
         <span tw="text-2xl sm:text-3xl font-bold text-white">{children}</span>
      </main>
   )
}
