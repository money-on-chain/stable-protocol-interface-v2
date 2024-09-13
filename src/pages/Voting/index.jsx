import React, { Fragment, useEffect, useState } from 'react';
// import React, { Fragment } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';

import Voting from '../../components/Voting';

import '../../assets/css/pages.scss';
console.log('Hey');

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
                    <div className={'layout-card'}>
                        <div className={'layout-card-title'}>
                            <h1>{t('voting.cardTitle')}</h1>
                        </div>
                        <Voting />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default SectionVoting;
