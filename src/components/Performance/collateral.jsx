import React, { useContext, useState, useEffect } from 'react';

import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import settings from '../../settings/settings.json';
import BigNumber from 'bignumber.js';

export default function CollateralAssets() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (
        <div className="list-tokens">

            { settings.tokens.CA.map(function (token, i) {
                return (
                    <div className="row-token" key={i}>
                        <div className="coll-1">
                            <div className="token">
                                <div className={`icon-token-ca_${i} token__icon`}></div>
                              <div className='token__name'>  {t(`portfolio.tokens.CA.rows.${i}.title`, {ns: ns})}</div>
                            </div>
                        </div>
                        <div className="coll-2">
                            <div className="amount-token">
                                {(!auth.contractStatusData.canOperate) ? '--' : PrecisionNumbers({
                                    amount: auth.contractStatusData ? auth.contractStatusData.getACBalance[i] : new BigNumber(0),
                                    token: TokenSettings(`CA_${i}`),
                                    decimals: 2,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: false
                                })}
                            </div>
                        </div>
                    </div>
                )})
            }

        </div>
    );
}
