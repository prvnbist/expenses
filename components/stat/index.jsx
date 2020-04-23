export const Stat = ({ type, loading, label, children }) => {
   return (
      <main
         className={`flex flex-col p-3 rounded-lg ${
            type === 'expenses' ? 'bg-red-400' : 'bg-indigo-400'
         }`}
      >
         <h3
            className={`text-sm font-bold sm:font-normal sm:text-base uppercase tracking-wider ${
               type === 'expenses' ? 'text-red-800' : 'text-indigo-800'
            }`}
         >
            {label}
         </h3>
         <span className="text-2xl sm:text-3xl font-bold text-white">
            {loading ? 'Loading...' : children}
         </span>
      </main>
   )
}
