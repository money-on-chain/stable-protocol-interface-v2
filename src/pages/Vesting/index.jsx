import React, { Fragment } from 'react';
import { useContext } from 'react';

import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';

import '../../assets/css/pages.scss';


function SectionVesting(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (
        <Fragment>

            {/* Send */}
            <div className={'dashboard-exchange'}>

                <div className={'title'}>
                    <h1>Staking</h1>
                </div>

                <div className={'content-body'}>

                </div>

            </div>


        </Fragment>
    );
}

export default SectionVesting;
