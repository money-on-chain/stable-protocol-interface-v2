import React, { useEffect } from 'react';

const RouterFlipmoney = React.lazy(() => import('./projects/flipmoney'));
const RouterRoc = React.lazy(() => import('./projects/roc'));
const RouterMoc = React.lazy(() => import('./projects/moc'));
const RouterStableX = React.lazy(() => import('./projects/stablex'));
const Router = () => {
    switch (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()) {
        case 'flipmoney':
            return RouterFlipmoney;
        case 'roc':
            return RouterRoc;
        case 'moc':
            return RouterMoc;
        case 'stablex':
            return RouterStableX;
        default:
            return RouterFlipmoney;
    }
};

export default Router();
