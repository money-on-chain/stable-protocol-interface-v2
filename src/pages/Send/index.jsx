import React, { Fragment, useState, useEffect } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import ListOperationsMobile from '../../components/Tables/ListOperationsMobile';
import { useProjectTranslation } from '../../helpers/translations';
import Send from '../../components/Send';


function SectionSend(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth) {
            setReady(true);
        }
    }, [auth]);
    return (
        <Fragment>
            <div className="section-container">
                {/* Send */}
                <div className="layout-card">
                    <div className={'layout-card-title'}>
                        <h1>{t('send.cardTitle')}</h1>
                    </div>

                    <div className={'content-body'}>
                        {ready ? <Send /> : <Skeleton active />}
                    </div>
                </div>

                <div className="section__innerCard--big content-last-operations">
                    <ListOperationsMobile token={'all'}></ListOperationsMobile>
                </div>
            </div>
        </Fragment>
    );
}

export default SectionSend;
