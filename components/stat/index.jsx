export const Stat = ({ type, loading, label, children }) => {
   return (
      <main
         className={`mr-3 flex flex-col p-3 rounded-lg ${
            type === 'expenses' ? 'bg-red-400' : 'bg-indigo-400'
         }`}
      >
         <h3
            className={`uppercase tracking-wider ${
               type === 'expenses' ? 'text-red-800' : 'text-indigo-800'
            }`}
         >
            {label}
         </h3>
         <span className="text-3xl font-bold text-white">
            {loading ? 'Loading...' : children}
         </span>
      </main>
   )
}
