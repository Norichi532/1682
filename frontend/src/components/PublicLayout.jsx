import Navbar from './Navbar'
import Footer from './Footer'
import FloatingContact from './FloatingContact'

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
      <FloatingContact />
    </div>
  )
}
