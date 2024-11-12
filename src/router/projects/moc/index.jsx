import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import NotFound from '../../../pages/NotFound';
const Skeleton = React.lazy(
    () =>
        import(
            '../../../layouts/projects/' +
                process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() +
                '/Skeleton'
        )
);
const Send = React.lazy(() => import('../../../pages/Send/index'));
const Staking = React.lazy(() => import('../../../pages/Staking/index'));
const Vesting = React.lazy(() => import('../../../pages/Vesting/index'));
const Voting = React.lazy(() => import('../../../pages/Voting/index'));
const liquidityMining = React.lazy(
    () => import('../../../pages/LiquidityMining/index')
);

export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <Skeleton />,
            children: [
                {
                    path: '/',
                    element: <Staking />
                },
                {
                    path: 'send',
                    element: <Send />
                },
                {
                    path: 'staking',
                    element: <Staking />
                },
                {
                    path: 'vesting',
                    element: <Vesting />
                },
                {
                    path: 'voting',
                    element: <Voting />
                },
                {
                    path: 'liquidity-mining',
                    element: <liquidityMining />
                },
                { path: '404', element: <NotFound /> },
                { path: '*', element: <Navigate to="/404" /> }
            ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }
    ]);
}
