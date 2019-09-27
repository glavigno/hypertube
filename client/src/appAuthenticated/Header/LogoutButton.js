import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { actionLogout } from '../../actions/authActions';
import AppContext from '../../contexts/AppContext';

export default function LogoutButton() {

    const { t, toggleConnected } = useContext(AppContext);

    const LogoutButton = styled.button`
        display: inline-block;
        padding: 8px 10px;
        border-radius: 3px;
        border: solid 1px gray;
        background-color: #202020;
        color: gray;
        font-size: 1rem;
        cursor: pointer;
        text-decoration: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        &:hover {
            background: ${props => props.theme.color.red};
            color: ${props => props.theme.color.white};
            border: none;
        }
        p {
            margin: 0;
        }
    `;

    const handleLogout = () => {
        actionLogout(toggleConnected);
    };

    return (
        <Link
            to="/"
            onClick={handleLogout}
        >
            <LogoutButton>
                <p>{t.header.logout}</p>
            </LogoutButton>
        </Link>
    );
}