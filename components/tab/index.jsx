export const Tab = ({ tab, type, children, onClick }) => {
   return (
      <button
         onClick={onClick}
         className={`focus:outline-none rounded-lg focus:bg-indigo-200 focus:text-indigo-800 py-2 px-3 ${
            tab === type ? 'bg-indigo-200 text-indigo-800' : ''
         }`}
      >
         {children}
      </button>
   )
}
