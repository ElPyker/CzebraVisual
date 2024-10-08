import { NavLink } from "react-router-dom";
import styled from "styled-components";

const LogoImg = styled.img`
    width: 150px;
`;

const NavbarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #364936;
  padding: 1rem 4rem;
  position: relative;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: 1010; /* Asegura que el menú principal esté por debajo */
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
  color: ${(props) => props.isproduction ? '#364936' : '#FAFBF3'};
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

const HamburgerMenu = styled.div`
  display: none;
  cursor: pointer;
  color: white;
  margin-right: -44px;
  padding: 0 1rem; // Agrega algo de espacio alrededor del ícono
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: #364936;
    z-index: 999; /* Asegura que el menú principal esté por debajo */
    border-top: 1px solid #ddd;
  }
`;

export { LogoImg, NavLinkWrapper, NavbarWrapper, StyledNavLink, HamburgerMenu, NavMenu };
