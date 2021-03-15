import React from 'react';
import { Link } from 'react-router-dom';
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
                    <Link to='/'>Home</Link>
                    <Link to='/predict'>Predict</Link>
                    <Link to='/'>About</Link>
                    <Link to='/'>Download</Link>
                    <Link to='/'>Contact</Link>
                </StyledLinks>
            </NavigationContent>
        </StyledNavigation>
    );
};

export default Navigation;