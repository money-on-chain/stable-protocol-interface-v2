import React, { Fragment, useEffect, useContext, useState } from 'react';
import {
  Skeleton
} from 'antd';

import Vesting from '../../components/Vesting';


function SectionVesting() {
  // const auth = useContext(AuthenticateContext);
  // useEffect(() => {
  //   if (auth.contractStatusData) {
  //     setReady(true);
  //   }
  // }, [auth])
  return (
    <Fragment>
      <div>
      <Vesting />
      </div>
    </Fragment>
  );
}

export default SectionVesting;
