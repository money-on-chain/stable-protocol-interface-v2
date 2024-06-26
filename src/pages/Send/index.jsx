import React, { Fragment, useState, useEffect } from 'react';
import { useContext } from 'react';
import { Skeleton } from 'antd';
import { AuthenticateContext } from '../../context/Auth';
import ListOperations from '../../components/Tables/ListOperations';
import { useProjectTranslation } from '../../helpers/translations';
import Send from '../../components/Send';

import '../../assets/css/pages.scss';


function SectionSend(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (auth) {
            setReady(true);
        }
    }, [auth])
    return (
        <Fragment>

            {/* Send */}
            <div className='dashboard-exchange'>

                <div className={'title'}>
                    <h1>{t('send.cardTitle')}</h1>
                </div>

                <div className={'content-body'}>
                    {ready ? <Send /> : <Skeleton active />}
                </div>

            </div>

            <div className="content-last-operations">
                <ListOperations token={'all'}></ListOperations>
            </div> 


        </Fragment>
    );
}

export default SectionSend;
