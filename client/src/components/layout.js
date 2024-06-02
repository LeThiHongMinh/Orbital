import Navbar from './navbar'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div >{children}</div>
    </div>
  )
}

export default Layout