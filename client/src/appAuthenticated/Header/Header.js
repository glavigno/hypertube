import React, { useEffect, useState, useRef, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import AppContext from '../../contexts/AppContext';
import cloudinary from 'cloudinary-core';
import { actionLogout } from '../../actions/authActions';
import HypertubeLogo from '../../Logo';
const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'dif6rqidm'});

const Header = styled.header`
    background-color: #202020;
    height: 70px;
    display: grid;
    grid-template-columns: 8fr 2fr 2fr;
    align-content: center;
    padding: 0 1.5rem;
    @media (max-width: 1000px) {
        padding:0;
    }
`;
const LogoContainer = styled(Link)`
    margin-left: 20px;
    display: flex;
    align-items: center;
`;
const Account = styled.section`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
`;
const Avatar = styled.img`
  height: 50px;
  width: 50px;
  object-fit:cover;
  border-radius: ${props => props.theme.borderRadius};
  background-color: black;
  cursor: pointer;
  @media (max-width: 1000px) {
      margin-right:0.5rem;
  }
`;
const DropDown = styled.div`
  width: 100px;
  top: 65px;
  right: 0px;
  border-radius: ${props => props.theme.borderRadius};
  background-color: #202020;
  position: absolute;
  padding: 30px;
  text-align: right;
  z-index: 999999;
  box-shadow: 0 15px 25px -10px rgba(0,0,0,.25);
`;
const StyledLink = styled(Link)`
    color: ${props => props.theme.color.white};
    font-size: 1rem;
    font-family: Roboto;
    font-weight: 700;
    text-decoration: none;
    &:hover {
        color: ${props => props.theme.color.red};
    }
`;
const LogoutSection = styled.section`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  @media (max-width: 1000px) {
      margin-right:0.5rem;
  }
`;

const StyledIcon = styled(FontAwesomeIcon) `
@media (max-width: 1000px) {
      display:none;
  }
`
export default function HeaderComp() {

    const { t, toggleConnected } = useContext(AppContext);
    const authToken = localStorage.getItem('authToken');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        let isSubscribed = true;
        const fetchData = async () => {
            try {
                const res = await axios.get(`/users/getAvatar?authToken=${authToken}`);
                if (isSubscribed) setAvatar(res.data.avatarPublicId);
            } catch(err) {
                if (err.response && err.response.status === 401) actionLogout(toggleConnected);
            }
        }
        if (authToken) fetchData();
        return () => isSubscribed = false;
    })

    const toggleDropdown = () => setDropdownOpen(true);

    const node = useRef();

    useEffect(() => {
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    const handleClickOutside = e => {
        if (node.current.contains(e.target)) return;
        setDropdownOpen(false);
    };

    return (
        <Header>
            <LogoContainer to="/search">
                <HypertubeLogo />
            </LogoContainer>
            <Account onClick={toggleDropdown}>
                <Avatar src={cloudinaryCore.url(avatar)}/>
                <StyledIcon style={{marginLeft: '10px', fontSize: '15px', color: 'white', cursor: 'pointer'}} icon={faChevronDown}/>
                { dropdownOpen &&
                    <DropDown ref={node}>
                        <p><StyledLink to="/search">{t.header.search}</StyledLink></p>
                        <p><StyledLink to="/myProfile">{t.header.profile}</StyledLink></p>
                        <p><StyledLink to="/language">{t.header.language}</StyledLink></p>
                    </DropDown>
                }
            </Account>
            <LogoutSection>
                <LogoutButton />
            </LogoutSection>
        </Header>
    )
}
