import React from 'react';
import { Link } from 'react-router-dom';
import {StyledNavigation, NavigationContent, LogoContainer, StyledLinks} from './NavigationStyles';

/**
 * Component for the navigation with links and logo.
 *
 * @component
 * @example
 *
 */
const Navigation = () => {
    return (
        <StyledNavigation>
            <NavigationContent>
                <LogoContainer>
                    <img alt='IO.db' src='./images/logos/logo-white.png'/>
                </LogoContainer>
                <StyledLinks>
                    <Link to='/'>Home</Link>
                    <Link to='/explore/biomarker/request'>Biomarker Evaluation</Link>
                    <Link to='/'>About</Link>
                    <Link to='/'>Download</Link>
                    <Link to='/'>Contact</Link>
                </StyledLinks>
            </NavigationContent>
        </StyledNavigation>
    );
};

export default Navigation;