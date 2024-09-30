import React, { Fragment, useEffect, useState } from 'react';
// import React, { Fragment } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';


import '../../assets/css/pages.scss';
import Voting from '../../components/Voting';


function SectionVoting(props) {
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
                <div className="content-page">
                    {ready ? <Voting /> : <Skeleton active />}
                </div>
            </div>
        </Fragment>
    );
}

export default SectionVoting;
