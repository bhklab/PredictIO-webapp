import React from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';

const StyledFooter = styled.div`
    position relative;
    bottom: 0%;
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
`

const FooterContent = styled.div`
    width: 85%;
    height: 100%;
    max-width: 1500px;
    margin-left: auto;
    margin-right: auto;
    border-top: 1px solid ${colors.blue};
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const FooterItem = styled.div`
    color: ${colors.blue};
    font-size: 10px;
    a {
        color: ${colors.blue};
    }
    .divider {
        margin: 0px 10px;
    }
`

const Footer = () => {
    return (
        <StyledFooter>
            <FooterContent>
                <FooterItem>
                    <span className='link'>Terms</span>
                    <span className='divider'>|</span>
                    <span className='link'>Privacy</span>
                    <span className='divider'>|</span>
                    <span className='link'>Support</span>
                </FooterItem>
                <FooterItem>
                    BHK Lab &#169; 2020-2021
                </FooterItem>
            </FooterContent>
        </StyledFooter>
    );
}

export default Footer;