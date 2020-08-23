import { Header } from './header'
import { Form } from './create_form'

export const Layout = ({ children }) => {
   const [isFormVisible, setIsFormVisible] = React.useState(false)
   return (
      <div className="m-3">
         <Header />
         <div className="flex lg:space-x-4 flex-col lg:flex-row">
            {children}
         </div>
         <button
            onClick={() => setIsFormVisible(true)}
            className="h-16 w-16 text-white fixed right-0 top-0 mr-6 mt-6 rounded-full bg-teal-600 hover:bg-teal-700"
         >
            Add
         </button>
         {isFormVisible && <Form setIsFormVisible={setIsFormVisible} />}
      </div>
   )
}
