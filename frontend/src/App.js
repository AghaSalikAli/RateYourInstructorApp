import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Homepage from './pages/homepage';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Departments from './pages/departments';
import Search from './pages/search';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route path="/departments" element={<Departments />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
