import React, { Fragment, useEffect, useState } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';
import 'antd/dist/antd.css';

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
            <div className="section-container">
                {/* <div className="content-page"> */}
                <div className={'content-vesting'}>
                    {ready ? <Vesting /> : <Skeleton active />}
                </div>
                {/* </div> */}
            </div>
        </Fragment>
    );
}

export default SectionVesting;
