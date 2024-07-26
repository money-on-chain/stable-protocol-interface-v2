import React, { Fragment, useState, useContext, useEffect } from 'react';
import { Skeleton } from 'antd';
import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';
import Voting from '../../components/Voting';

const SectionVoting = () => {
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
            <div >{ready ? <Voting /> : <Skeleton active />}</div>
        </Fragment>
    );
};

export default SectionVoting;
