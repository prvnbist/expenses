export const Label = ({ htmlFor, children }) => (
   <label
      htmlFor={htmlFor}
      className="uppercase text-gray-500 text-sm tracking-wider"
   >
      {children}
   </label>
)

export const Input = props => (
   <input {...props} className="w-full mt-2 border rounded h-12 px-3" />
)

export const Field = ({ children, ...props }) => (
   <fieldset className="mb-4 mr-4 flex flex-col flex-1" {...props}>
      {children}
   </fieldset>
)

export const Select = ({ list, ...props }) => (
   <select className="w-full mt-2 border rounded h-12 px-3" {...props}>
      {list.map((item, index) => (
         <option key={index} value={item}>
            {item}
         </option>
      ))}
   </select>
)
