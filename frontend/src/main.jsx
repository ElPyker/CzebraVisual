import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Home from './components/pages/Home';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CompaniePage from './components/pages/requests/CompaniePage.jsx';
import RequestPage from './components/pages/requests/RequestPage.jsx';
import Login from './components/pages/users/Login.jsx';
import Profile from './components/pages/users/Profile.jsx';
import './Styled/ResponsiveANTD.css';

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  children: [
    { path: "login", element: <Login /> },
    { path: "home", element: <Home /> },
    { path: "companies", element: <CompaniePage /> },
    { path: "requests", element: <RequestPage /> },
    { path: "profile", element: <Profile /> },
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

