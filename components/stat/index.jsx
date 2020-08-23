const typePicker = type => {
   switch (type) {
      case 'expenses':
         return ['bg-red-400', 'text-red-800']
      case 'earnings':
         return ['bg-indigo-400', 'text-indigo-800']
      case 'neutral':
         return ['bg-gray-400', 'text-gray-600']
      default:
         return ['bg-red-400', 'text-red-800']
   }
}

export const Stat = ({ type, label, children }) => {
   return (
      <main className={`flex flex-col p-3 rounded-lg ${typePicker(type)[0]}`}>
         <h3
            className={`text-sm font-bold sm:font-normal sm:text-base uppercase tracking-wider ${
               typePicker(type)[1]
            }`}
         >
            {label}
         </h3>
         <span className="text-2xl sm:text-3xl font-bold text-white">
            {children}
         </span>
      </main>
   )
}
