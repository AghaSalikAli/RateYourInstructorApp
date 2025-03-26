import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Homepage from './pages/homepage';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Departments from './pages/departments';
import VerifyEmail from './pages/verifyEmail';
import VerifyResult from './pages/verifyResult';
import Search from './pages/search';
import DepartmentDetails from "./pages/departmentDetails";
import InstructorProfile from "./pages/instructorProfile";
import InstructorRating from "./pages/instructorRating";
import PrivateRoute from './components/privateRoute';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-result" element={<VerifyResult />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/search" element={<Search />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/department/:id" element={<DepartmentDetails />} />
            <Route path="/instructor/add-rating/:id" element={<InstructorRating />} />
            <Route path="/instructor/:id" element={<InstructorProfile />} />
          </Route>
          
          <Route path="*" element={<h1>Error 404 - PAGE NOT FOUND</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
