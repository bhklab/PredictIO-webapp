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
                    <Link to='/explore/precomputed'>Pre-computed Signatures</Link>
                    <Link to='/explore/biomarker/request'>Biomarker Evaluation</Link>
                    <Link to='/predict/main'>PredictIO</Link>
                    <Link to='/datasets'>Datasets</Link>
                    <Link to='/about'>About</Link>
                    <Link to='/contact'>Contact</Link>
                </StyledLinks>
            </NavigationContent>
        </StyledNavigation>
    );
};

export default Navigation;
