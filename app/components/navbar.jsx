import { NavLink } from '@remix-run/react'

export const Navbar = () => {
   return (
      <nav>
         <NavLink to="/">Home</NavLink>
         <div className="spacer-sm" />
         <NavLink to="/transactions/?sort=date.desc,title.asc">Transactions</NavLink>
      </nav>
   )
}
