import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages';
import Checkout from './pages/checkout';
import Orders from './pages/orders';
import Admin from './pages/Admin'; //추가

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<Admin />} /> {/* 추가 */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
