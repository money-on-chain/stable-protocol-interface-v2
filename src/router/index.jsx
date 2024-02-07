import React, { useEffect } from 'react';

const RouterFlipago = React.lazy(() => import('./projects/flipago'));
const RouterRoc = React.lazy(() => import('./projects/roc'));
const Router = () => {
    switch (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()) {
        case 'flipago':
            return RouterFlipago;
        case 'roc':
            return RouterRoc;
        default:
            return RouterFlipago;
    }
};

export default Router();
