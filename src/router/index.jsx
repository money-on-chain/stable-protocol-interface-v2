import React, { useEffect } from 'react';

const RouterFlipmoney = React.lazy(() => import('./projects/flipmoney'));
const RouterRoc = React.lazy(() => import('./projects/roc'));
const Router = () => {
    switch (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()) {
        case 'flipmoney':
            return RouterFlipmoney;
        case 'roc':
            return RouterRoc;
        default:
            return RouterFlipmoney;
    }
};

export default Router();
