import styled from 'styled-components';

export const NavContainer = styled.nav`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
    position: relative;
    flex-wrap: wrap;
`;

export const NavLogo = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: #364936;
`;

export const NavItem = styled.div`
    margin: 0 10px;
    position: relative;
    padding: 8px 12px;
    cursor: pointer;
    a {
        text-decoration: none;
        color: #333;
    }
    &:hover {
        background-color: #e0e0e0;
        border-radius: 4px;
    }
`;

export const HamburgerMenu = styled.div`
    display: none;
    cursor: pointer;
    @media (max-width: 768px) {
        display: block;
    }
`;

export const NavMenu = styled.div`
    display: flex;
    align-items: center;
    @media (max-width: 768px) {
        display: ${props => (props.isOpen ? 'flex' : 'none')};
        flex-direction: column;
        position: absolute;
        top: 100%; /* Ajustado para eliminar el espacio */
        left: 0;
        width: 100%;
        background-color: #f5f5f5;
        z-index: 1000;
        border-top: 1px solid #ddd;
    }
`;

export const NavSearchContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
    position: relative;
    justify-content: space-between;
    gap: 20px;
    width: 100%;

    @media (max-width: 768px) {
        justify-content: space-between;
        flex-wrap: wrap;
    }
`;

export const SearchIcon = styled.div`
    display: none;
    cursor: pointer;
    margin-left: 10px;
    @media (max-width: 768px) {
        display: block;
        order: 3;
    }
`;

export const NavSearch = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    flex-grow: 1;
    margin-right: 20px;
    position: relative;

    @media (max-width: 768px) {
        display: ${props => (props.isSearchOpen ? 'flex' : 'none')};
        width: 100%;
        order: 4;
        margin-top: 10px;
    }

    input {
        border: none;
        padding: 5px;
        margin-left: 5px;
        flex-grow: 1;
        outline: none;
    }

    button {
        border: none;
        background: none;
        padding: 5px 10px;
        cursor: pointer;
    }
`;

export const FilterOption = styled.div`
    padding: 5px 10px;
    background-color: #eee;
    margin-right: 5px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: #ccc;
    }
`;

export const FilterTag = styled.div`
    display: flex;
    align-items: center;
    background-color: #eee;
    padding: 5px 10px;
    margin-right: 5px;
    border-radius: 4px;
    span {
        margin-left: 5px;
        cursor: pointer;
    }
`;

export const FilterDropdown = styled.div`
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    padding: 10px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    width: 100%;
`;

export const SubFilterDropdown = styled.div`
    position: absolute;
    top: 0;
    left: 100%;
    background-color: white;
    border: 1px solid #ddd;
    padding: 10px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
`;

export const NavPagination = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    @media (max-width: 768px) {
        order: 2;
        margin-left: auto;
    }

    button {
        padding: 5px 10px;
        cursor: pointer;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin: 0 5px;
    }

    span {
        margin: 0 5px;
    }

    .active {
        background-color: #007bff;
        color: white;
        border-color: #007bff;
    }

    &:hover {
        background-color: #e0e0e0;
    }
`;

export const NewButton = styled.button`
    background-color: #97b25e;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #364936;
    }

    svg {
        margin-right: 5px;
    }

    @media (max-width: 768px) {
        order: 1;
    }
`;

export const DropdownContainer = styled.div`
    position: relative;
    display: inline-block;
`;

export const DropdownMenu = styled.div`
    display: ${props => (props.isOpen ? 'block' : 'none')};
    position: absolute;
    background-color: #ffffff;
    min-width: 240px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    border-radius: 4px;
    border: 1px solid #ddd;
`;

export const DropdownItem = styled.div`
    color: ${props => (props.isLabel ? 'grey' : 'black')};
    padding: 8px 16px;
    text-decoration: none;
    display: block;
    cursor: ${props => (props.isLabel ? 'default' : 'pointer')};
    font-weight: ${props => (props.isLabel ? 'bold' : 'normal')};
    font-size: 14px;
    &:hover {
        background-color: ${props => (props.isLabel ? 'transparent' : '#e0e0e0')};
    }
    a {
        color: inherit;
        text-decoration: none;
        display: block;
    }
`;

export const NavBarContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const NavBarActionsFiltersContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
    width: 100%;

    @media (max-width: 768px) {
        flex-wrap: wrap;
    }
`;

// Estilos para la tabla de warehouses
export const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
`;

export const TableHead = styled.thead`
    background-color: #f5f5f5;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }
`;

export const TableCell = styled.td`
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
`;

export const TableHeaderCell = styled.th`
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
    background-color: #f5f5f5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
`;
