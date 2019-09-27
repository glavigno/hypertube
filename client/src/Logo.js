import React from 'react';
import styled from 'styled-components';
import cloudinary from 'cloudinary-core';
const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'dif6rqidm'});

const Logo = styled.img`
    width: 150px;
`;

export default function LogoComp() {
    return (
        <Logo src={cloudinaryCore.url('hypertube_logo')}></Logo>
    )
}
