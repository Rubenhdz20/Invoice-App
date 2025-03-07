import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import Header from './components/Header';
import './index.css'

function App() {
  return (
    <Router>
      <Header/>
      <main className='p-6'>
        <Routes>
          <Route path="/home" element={<Navigate to="/home" />} /> // Invoice List component 
          <Route path="/invoice/:id" element={<div>Home</div>} /> // Invoice detail component
          <Route path="/create-invoice" element={<div>About</div>} /> // Create Invoice component
          <Route path="/edit-invoice/:id" element={<div>Contact</div>} /> // Edit Invoice component
          {/* <Route path="*" element={<div>404 Not Found</div>} /> // 404 component */}
        </Routes>
      </main>
    </Router>
  )
}

export default App;