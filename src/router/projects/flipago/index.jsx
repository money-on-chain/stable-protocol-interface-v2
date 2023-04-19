import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import NotFound from '../../../pages/NotFound';
const Skeleton = React.lazy(() =>
    import(
        '../../../layouts/projects/' +
            process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() +
            '/Skeleton'
    )
);

const Home = React.lazy(() => import('../../../pages/Home/index'));
const Exchange = React.lazy(() => import('../../../pages/Exchange/index'));

export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <Skeleton />,
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: 'exchange',
                    element: <Exchange />
                },
                { path: '404', element: <NotFound /> },
                { path: '*', element: <Navigate to="/404" /> }
            ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }
    ]);
}
