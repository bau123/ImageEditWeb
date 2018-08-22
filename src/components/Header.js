import React from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import CrownIcon from '@govuk-react/icon-crown';
import Main from '@govuk-react/main';
import TopNav, { asTopNavAnchor, asNavLinkAnchor } from '@govuk-react/top-nav';
import PhaseBanner from '@govuk-react/phase-banner';
import Header from '@govuk-react/header';

const LogoAnchor = asTopNavAnchor('a');
const NavAnchor = asNavLinkAnchor(Link);
const tempHref = 'https://gov.uk';

const StyledHeader = styled('div')({});

const HeaderMain = styled(Main)({
    paddingTop: 0
});

const Company = (
    <LogoAnchor href={tempHref} target="new">
        <TopNav.IconTitle icon={<CrownIcon width="36" height="32" />}>
            GOV.UK
        </TopNav.IconTitle>
    </LogoAnchor>
);

const ServiceTitle = (
    <NavAnchor to="/">
        <Header mb={0} level={3}>
            Crip Crop Bop
        </Header>
    </NavAnchor>
);

const PageHeader = () => (
    <StyledHeader>
        <TopNav company={Company} serviceTitle={ServiceTitle}>
        </TopNav>
        <HeaderMain>
            <PhaseBanner level="alpha">
                Creating Cropping tool for the pc peeps
            </PhaseBanner>
        </HeaderMain>
    </StyledHeader>
);

export default PageHeader;
