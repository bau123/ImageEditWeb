import React from 'react';
import styled from 'react-emotion';

const StyledPage = styled('div')({
    '-webkitFontSmoothing': 'antialiased'
});

const Page = ({ children, ...props }) => (
    <StyledPage {...props}>{children}</StyledPage>
);

export default Page;
