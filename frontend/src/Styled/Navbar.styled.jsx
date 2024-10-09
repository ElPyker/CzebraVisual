import { NavLink } from "react-router-dom";
import styled from "styled-components";

const LogoImg = styled.img`
    width: 150px;
`;

const NavbarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000; /* Cambia el fondo a negro */
  padding: 1rem 4rem;
  position: relative;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: 1010;
`;

const NavLinkWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  transition: color 0.3s, background-color 0.4s, padding 0.3s, border-radius 0.3s;
  color: ${(props) => props.isproduction ? '#000' : '#FAFBF3'}; /* Texto claro para fondo oscuro */
  margin-left: 2rem;
  padding: ${(props) => props.isproduction ? '0' : '0.5rem 1rem'};
  border-radius: ${(props) => props.isproduction ? '0' : '30px'};

  &:hover {
    color: #97B25E;
  }

  &.${(props) => props.activeclassname} {
    background: ${(props) => props.isproduction ? '' : '#97B25E'};
    color: ${(props) => props.isproduction ? '#97B25E' : '#FAFBF3'};

    &:hover {
      color: ${(props) => props.isproduction ? '#97B25E' : '#FAFBF3'};
    }
  }

  @media (max-width: 768px) {
    margin: 1rem 0;
    width: 100%;
    text-align: center;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  background-color: #000; /* Fondo negro para el menú desplegable */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Sombra para dar profundidad */
  border-radius: 0 0 8px 8px; /* Bordes redondeados en la parte inferior */
  transition: all 0.3s ease-in-out; /* Transición suave */

  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.95); /* Fondo semi-transparente */
    border-top: 1px solid #444; /* Borde superior para separación */
    padding: 1rem 0; /* Espaciado interno */
    z-index: 999;
  }
`;
const HamburgerMenu = styled.div`
  display: none;
  cursor: pointer;
  color: white;
  margin-right: -44px;
  padding: 0 1rem;
  transition: color 0.3s ease-in-out; /* Transición para suavizar el cambio de color */

  @media (max-width: 768px) {
    display: block;

    &:hover {
      color: #97B25E; /* Cambia el color del icono al pasar el ratón */
    }
  }
`;
// Styled/Navbar.styled.js
const ProfileLink = styled(StyledNavLink)`
  color: #FAFBF3;
  margin: 1rem 0;
  width: 100%;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    color: #97B25E;
  }
`;

export { LogoImg, NavLinkWrapper, NavbarWrapper, StyledNavLink, HamburgerMenu, NavMenu, ProfileLink };

