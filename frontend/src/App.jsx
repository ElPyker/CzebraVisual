// App.jsx
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GlobalStyles } from './Styled/Global.styled';
import { Outlet } from 'react-router-dom';
import Login from './components/pages/users/Login';
import { logout as performLogout } from './ApiClient';

export const App = () => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role'));
  const [userName, setUserName] = useState(localStorage.getItem('user_name'));

  useEffect(() => {
    if (location.pathname === '/') {
      performLogout();
      setToken(null);
      setUserRole(null);
      setUserName(null);
    }
  }, [location]);

  if (!token) {
    return <Login setToken={setToken} setUserRole={setUserRole} setUserName={setUserName} />;
  }

  return (
    <div className='App'>
        <Navbar userRole={userRole} userName={userName} setToken={setToken} setUserRole={setUserRole} setUserName={setUserName} />      <Outlet />
      <GlobalStyles />
    </div>
  );
};

export default App;