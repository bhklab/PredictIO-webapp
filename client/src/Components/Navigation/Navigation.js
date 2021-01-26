import React from 'react';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';
import {StyledNavigation, NavigationContent, LogoContainer, StyledLinks} from '../../styles/NavigationStyles';

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
                    <img alt='IO.db' src='./images/logos/IOdb-logo-white.png'/>
                </LogoContainer>
                <StyledLinks>
                    <Link to='/' onClick={(e) => {window.location.reload()}}>Home</Link>
                    <Link to='/'>About</Link>
                    <Link to='/'>Download</Link>
                    <Link to='/'>Contact</Link>
                </StyledLinks>
            </NavigationContent>
        </StyledNavigation>
    );
};

export default Navigation;