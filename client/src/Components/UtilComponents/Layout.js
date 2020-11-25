import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
/**
 * wrapper for every page
 */
const Layout = (props) => {
    const {children} = props;
    return(
        <React.Fragment>
            <Navigation />
            <main>
                {children}
            </main>
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