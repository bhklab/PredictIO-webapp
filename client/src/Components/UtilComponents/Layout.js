import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import styled from 'styled-components';

const Main = styled.main`
    min-height: 100vh;
    width: 90%;
    max-width: 1500px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 200px;
    display: flex;
    flex-direction: column;
`;

/**
 * wrapper for every page
 */
const Layout = (props) => {
    const {children} = props;
    return(
        <React.Fragment>
            <Navigation />
            <Main>
                {children}
            </Main>
            <Footer />
        </React.Fragment>
    );
};

Layout.propTypes = {
    /**
     * Layout's children (components on the page)
     */
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
  
Layout.defaultProps = {
    page: '',
    children: null,
};

export default Layout;