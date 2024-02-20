import React, { Fragment, useState, useEffect } from 'react';
import { useContext } from 'react';
import {
    Skeleton
  } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';
import '../../assets/css/pages.scss';
import Staking from '../../components/Staking';


function SectionStaking(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth])
    return (
        <Fragment>
            <div className={'content-body'}>
                {ready ?  <Staking/> : <Skeleton active />}
            </div>
        </Fragment>
    );
}

export default SectionStaking;
