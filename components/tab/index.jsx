export const Tab = ({ tab, type, children, onClick }) => {
   return (
      <button
         onClick={onClick}
         className={`focus:outline-none focus:border-indigo-400 py-2 px-3 border-b-2 ${
            tab === type ? 'border-indigo-600' : ''
         }`}
      >
         {children}
      </button>
   )
}
