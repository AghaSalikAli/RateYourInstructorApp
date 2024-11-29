import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/homepage';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Departments from './pages/departments';
import Search from './pages/search';
import DepartmentDetails from "./pages/departmentDetails";
import InstructorProfile from "./pages/instructorProfile";
import InstructorRating from "./pages/instructorRating";
import './styles/App.css';
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes (Only accessible if authenticated) */}
          <Route element={<PrivateRoute />}>
            <Route path="/search" element={<Search />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/department/:id" element={<DepartmentDetails />} />
            <Route path="/instructor/add-rating/:id" element={<InstructorRating />} />
            <Route path="/instructor/:id" element={<InstructorProfile />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<h1>Error 404 - PAGE NOT FOUND</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;