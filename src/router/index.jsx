import React, { useEffect } from 'react';

const RouterFlipago = React.lazy(() => import('./projects/flipago'));

const Router = () => {
    switch (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()) {
        case 'flipago':
            return RouterFlipago;
        default:
            return RouterFlipago;
    }
};

export default Router();
