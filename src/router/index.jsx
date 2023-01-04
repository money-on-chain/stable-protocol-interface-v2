import React, { useEffect } from 'react';

import {config} from "../projects/config";

const RouterFlipago = React.lazy(() => import('./projects/flipago'));

const Router = () => {
  switch (config.environment.AppProject.toLowerCase()) {
    case 'flipago':
        return RouterFlipago
    default:
        return RouterFlipago
  }

}

export default Router();