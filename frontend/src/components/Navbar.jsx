import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { NavLinkWrapper, NavbarWrapper, StyledNavLink, HamburgerMenu, NavMenu } from '../Styled/Navbar.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown, Button } from 'antd';
import { logout as performLogout, apiClient } from '../ApiClient';
import { API_URL_DIVISIONS, API_URL_DIVISION_USERS } from './pages/Config';

export const Navbar = ({ userRole, userName, setToken, setUserRole, setUserName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const [userDivision, setUserDivision] = useState(null);
  const [divisionName, setDivisionName] = useState('General');
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch divisions
    apiClient.get(API_URL_DIVISIONS)
      .then(response => {
        setDivisions(response.data);
      })
      .catch(error => {
        console.error('Error fetching divisions:', error);
      });

    // Fetch user division
    const userId = localStorage.getItem('user_id');
    if (userId) {
      apiClient.get(`${API_URL_DIVISION_USERS}?user=${userId}`)
        .then(response => {
          const userDivisionData = response.data.find(item => item.user === parseInt(userId));
          if (userDivisionData) {
            setUserDivision(userDivisionData.division);
          }
        })
        .catch(error => {
          console.error('Error fetching user division:', error);
        });
    }
  }, []);

  useEffect(() => {
    // Update division name and links based on the user division
    if (userDivision && divisions.length > 0) {
      const division = divisions.find(d => d.division_id === userDivision);
      if (division) {
        setDivisionName(division.name);
        switch (division.division_id) {
          case 1:
            setLinks([{ page: "Home", href: "/home" }]);
            break;
          case 2:
            setLinks([{ page: "Requests", href: "/requests" }]);
            break;
          default:
            setLinks([
              { page: "Home", href: "/home" },
              { page: "Requests", href: "/requests" }
            ]);
            break;
        }
      }
    } else {
      // Default to showing all links if no specific division is found
      setLinks([
        { page: "Home", href: "/home" },
        { page: "Requests", href: "/requests" }
      ]);
    }
  }, [userDivision, divisions]);

  useEffect(() => {
    // Redirect if user tries to access a page not allowed by their division
    if (userDivision && divisions.length > 0) {
      const division = divisions.find(d => d.division_id === userDivision);
      if (division) {
        const notAllowedPaths = {
          1: ["/home"] // Home

        };
        if (notAllowedPaths[division.division_id].includes(location.pathname)) {
          navigate('/home');
        }
      }
    }
  }, [location.pathname, userDivision, divisions, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);

  };

  const handleLogout = () => {
    performLogout();
    localStorage.clear(); // Esto eliminará todas las claves de almacenamiento local
    setToken(null);
    setUserRole(null);
    setUserName(null);
    navigate('/login');
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'manage_users') {
      navigate('/user');
    }
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    {
      key: 'user',
      disabled: true,
      label: (
        <div>
          <strong>Nombre:</strong> {userName}
          <br />
          <strong>Rol:</strong> {userRole}
          <br />
          <strong>División:</strong> {divisionName}
        </div>
      ),
    },
    { type: 'divider' },
    userRole === 'Admin' && userDivision === null && {
      key: 'manage_users',
      label: 'Manage Users',
    },
    {
      key: 'logout',
      label: (
        <div onClick={handleLogout}>
          Logout
        </div>
      ),
    },
  ].filter(Boolean);  // Filtrar elementos nulos o falsos

  return (
    <NavbarWrapper>
      <Link to="/home">
        <Logo />
      </Link>
      <HamburgerMenu onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} size="lg" />
      </HamburgerMenu>
      <NavMenu isopen={isMenuOpen ? 'true' : undefined}>
        <NavLinkWrapper>
          {links.map((link) => (
            <StyledNavLink activeclassname="active" key={link.page} to={link.href} onClick={handleLinkClick}>
              {link.page}
            </StyledNavLink>
          ))}
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button
              type="link"
              style={{
                padding: 0,
                color: '#FAFBF3',
                marginLeft: '2rem',
              }}
            >
              <FontAwesomeIcon icon={faUser} width="20px" color="#FAFBF3" />
            </Button>
          </Dropdown>
        </NavLinkWrapper>
      </NavMenu>
    </NavbarWrapper>
  );
};

export default Navbar;
