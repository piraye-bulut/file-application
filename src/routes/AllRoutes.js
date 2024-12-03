
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home'; 
import { Signup } from '../pages/Signup'; 
import { LoginPage } from '../pages/LoginPage'; 
import { Dashboard } from '../pages/Dashboard'; 
import { SendFile } from '../pages/SendFile'; 
import { ReceivedFiles } from '../pages/ReceivedFiles';


export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" 
        element={
          
            <Dashboard />
          
        }
      />
      <Route path="/sendfile" 
        element={
          
            <SendFile />
          
        }
      />
      <Route path="/receivedfiles" 
        element={
          
            <ReceivedFiles />
          
        }
      />
    </Routes>
  );
};