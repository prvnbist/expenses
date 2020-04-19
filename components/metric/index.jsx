export const Metric = ({ type, loading, label, children }) => {
   if (type === 'expenses') {
      return (
         <main className="mr-3 mb-3 flex items-center p-3 rounded-lg bg-red-400">
            <span className="text-lg font-md text-white">
               {!loading ? children : 'Loading...'} {label}
            </span>
         </main>
      )
   }
   return (
      <main className="mr-3 mb-3 flex items-center p-3 rounded-lg bg-indigo-400">
         <span className="text-lg font-md text-white">
            {!loading ? children : 'Loading...'} {label}
         </span>
      </main>
   )
}
