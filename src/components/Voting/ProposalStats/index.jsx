import React from 'react';
import { useProjectTranslation } from '../../../helpers/translations';
import BigNumber from 'bignumber.js';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import { TokenSettings } from '../../../helpers/currencies';
import './Styles.scss';

function ProposalStats(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const space = '\u00A0';

    // Check that amount and percentage are an instance of BigNumber
    const amountBig =
        props.amount instanceof BigNumber
            ? props.amount
            : new BigNumber(props.amount);
    const percentageBig =
        props.percentage instanceof BigNumber
            ? props.percentage
            : new BigNumber(props.percentage);

    // Convert data for display compatibility
    const amountDisplay = amountBig.toNumber();
    const percentageDisplay = percentageBig.toNumber();

    return (
        <>
            {amountDisplay != null && (
                <div className="statContainer">
                    <div className="statLabel">{props.label}</div>
                    {/* <div className="statSeparator">:</div> */}
                    <div className="statAmount">
                        {PrecisionNumbers({
                            amount: amountBig,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </div>
                    <div className="statPercentage">
                        (
                        {PrecisionNumbers({
                            amount: percentageBig,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                        %)
                    </div>
                </div>
            )}
        </>
    );
}
export default ProposalStats;
