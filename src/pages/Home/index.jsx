import React, { Fragment } from 'react';
import { useContext } from 'react';
import {Row, Alert } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import ListOperations from "../../components/Tables/ListOperations";
import { useProjectTranslation } from '../../helpers/translations';

import '../../assets/css/pages.scss';


function Home(props) {

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const { docBalance = '0', bproBalance = '0', bprox2Balance = '0' } = auth.userBalanceData ? auth.userBalanceData : {};
    
    return (
        <Fragment>
            <div className="content-last-operations">
                <ListOperations token={'all'}></ListOperations>
            </div>
        </Fragment>
    );
}

export default Home;