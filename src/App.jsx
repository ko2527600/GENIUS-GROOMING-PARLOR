import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import LiveChat from './components/LiveChat'
import WelcomePopup from './components/WelcomePopup'
import ScrollToHash from './ScrollToHash'

// Code-split: both pull in the Blob upload client (for inspiration photo /
// admin media uploads), which Home-page visitors never need to download.
const BookingPage = lazy(() => import('./pages/BookingPage'))
const Admin = lazy(() => import('./pages/Admin'))

function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToHash />
      {!isAdmin && <Navbar />}
      {!isAdmin && <LiveChat />}
      {pathname === '/' && <WelcomePopup />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/booking"
            element={
              <Suspense fallback={null}>
                <BookingPage />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={null}>
                <Admin />
              </Suspense>
            }
          />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}

export default App
