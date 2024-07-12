import React, { Fragment, useEffect, useState } from 'react';
// import React, { Fragment } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';

import Vesting from '../../components/Vesting';

import '../../assets/css/pages.scss';

function SectionVesting(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth.contractStatusData) {
            setReady(true);
        }
    }, [auth]);

    return (
        <Fragment>
            <div className={'content-vesting'}>{ready ? <Vesting /> : <Skeleton active />}</div>
        </Fragment>
    );
}

export default SectionVesting;
