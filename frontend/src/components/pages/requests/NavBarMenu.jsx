import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Menu } from 'antd';
import {
    NavContainer, NavItem, NavLogo, HamburgerMenu, NavMenu
} from '../Styled/InventoryNavBar.styled';

const NavBarMenu = ({ title }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const operationsMenu = (
        <Menu>
            <Menu.Item disabled>Reabastecimiento</Menu.Item>
            <Menu.Item><Link to="/inventory/request-restock">Restock</Link></Menu.Item>
            <Menu.Item disabled>Traslados</Menu.Item>
            <Menu.Item><Link to="/inventory/receipts">Receipts</Link></Menu.Item>
        </Menu>
    );

    const reportsMenu = (
        <Menu>
            <Menu.Item><Link to="/inventory/stock">Stock</Link></Menu.Item>
            <Menu.Item><Link to="/inventory/operation-log">Movement History</Link></Menu.Item>
        </Menu>
    );

    const settingsMenu = (
        <Menu>
            <Menu.Item disabled>Warehouse Management</Menu.Item>
            <Menu.Item><Link to="/inventory/warehouses">Warehouses</Link></Menu.Item>
            <Menu.Item disabled>Supplier Management</Menu.Item>
            <Menu.Item><Link to="/inventory/suppliers">Suppliers</Link></Menu.Item>
            <Menu.Item disabled>Products</Menu.Item>
            <Menu.Item><Link to="/inventory/categories">Categories</Link></Menu.Item>
            <Menu.Item><Link to="/inventory/products">Products</Link></Menu.Item>
            <Menu.Item><Link to="/inventory/raw-materials">Raw Materials</Link></Menu.Item>
            <Menu.Item><Link to="/inventory/request-restock-warehouse">Restock Requests Warehouse</Link></Menu.Item>
        </Menu>
    );

    return (
        <NavContainer>
            <NavLogo>{title}</NavLogo>
            <HamburgerMenu onClick={toggleMenu} className="hamburger-right">
                <FontAwesomeIcon icon={faBars} size="lg" />
            </HamburgerMenu>
            <NavMenu isOpen={isMenuOpen}>
                <Dropdown overlay={operationsMenu} placement="bottomLeft" trigger={['click']}>
                    <NavItem>Operations</NavItem>
                </Dropdown>
                <Dropdown overlay={reportsMenu} placement="bottomLeft" trigger={['click']}>
                    <NavItem>Reports</NavItem>
                </Dropdown>
                <NavItem><Link to="/requests">Requests</Link></NavItem>
                <Dropdown overlay={settingsMenu} placement="bottomLeft" trigger={['click']}>
                    <NavItem>Settings</NavItem>
                </Dropdown>
            </NavMenu>
        </NavContainer>
    );
};

export default NavBarMenu;
