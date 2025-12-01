import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages';
import Checkout from './pages/checkout';
import Orders from './pages/orders';
import Admin from './pages/Admin';

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar cart={cart} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
