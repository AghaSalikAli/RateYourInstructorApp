import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Homepage from './pages/homepage';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Departments from './pages/departments';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/departments" element={<Departments />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
