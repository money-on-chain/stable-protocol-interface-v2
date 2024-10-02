import { useProjectTranslation } from '../../helpers/translations';
import React, { useContext, useEffect, useState } from 'react';
import { AuthenticateContext } from '../../context/Auth';
import Proposals from './Proposals';
import Vote from './Vote';

export default function Voting(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (
        <div className={'layout-card'}>

            <div className={'layout-card-title'}>
                <h1>Proposals</h1>
            </div>

            <div className="section voting__proposals">
                <Proposals />
            </div>

            {/* VOTING STAGE */}
            <div className="section voting">
                <Vote />
            </div>
        </div>
    )
}