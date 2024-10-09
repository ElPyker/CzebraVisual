import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { NavLinkWrapper, NavbarWrapper, StyledNavLink, HamburgerMenu, NavMenu } from '../Styled/Navbar.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown, Button, Menu } from 'antd';
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
    setLinks([
      { page: "Home", href: "/home" },
      { page: "Requests", href: "/requests" }
    ]);
  }, [userDivision, divisions]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    performLogout();
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    setUserName(null);
    navigate('/login');
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
    {
      key: 'profile',
      label: (
        <div onClick={() => navigate('/profile')}>
          Show Profile
        </div>
      ),
    },
    {
      key: 'logout',
      label: (
        <div onClick={handleLogout}>
          Logout
        </div>
      ),
    },
  ];

  return (
    <NavbarWrapper>
      <Link to="/home">
        <Logo />
      </Link>
      <HamburgerMenu onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} size="lg" />
      </HamburgerMenu>
      <NavMenu isOpen={isMenuOpen}>
        <NavLinkWrapper>
          {links.map((link) => (
            <StyledNavLink activeclassname="active" key={link.page} to={link.href} onClick={() => setIsMenuOpen(false)}>
              {link.page}
            </StyledNavLink>
          ))}
          <Dropdown overlay={<Menu items={menuItems} />} trigger={['click']}>
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
