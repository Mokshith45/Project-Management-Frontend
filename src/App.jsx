import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Layout from './components/Layout';
import AppRoutes from './routes/AppRoutes';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* has login/auth section in this */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* which has side and navbar in this section */}
        <Route
          path="/*"
          element={
            <Layout>
              <ProtectedRoute>
                <AppRoutes />
              </ProtectedRoute>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
