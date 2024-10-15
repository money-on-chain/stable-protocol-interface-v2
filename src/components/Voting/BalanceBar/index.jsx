import React from 'react';
import './Styles.scss';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import { TokenSettings } from '../../../helpers/currencies';
import { useProjectTranslation } from '../../../helpers/translations';

function BalanceBar(props) {
    const [t, i18n, ns] = useProjectTranslation();
    return (
        <div className="balanceBar">
            <div className="balanceBar__labels">
                <div className="label">{props.against} Against</div>
                <div className="label">{props.infavor} In favor</div>
            </div>
            <div className='balanceBar__wrapper'>
                <div
                    className={`against ${props.against === '100%' ? ' maxvalue' : ''}`}
                    style={{ width: props.against }}
                ></div>

                <div className='graphDivider'></div>
                <div
                    className={`infavor ${props.infavor === '100%' ? ' maxvalue' : ''}`}
                    style={{ width: props.infavor }}
                ></div>

            </div>
            <div className="balanceBar__labels">
                <div className={'balanceBar__labels__againstVotes'}>
                    {PrecisionNumbers({
                        amount: props.againstVotes,
                        token: TokenSettings('TG'),
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                    {' '}
                    against
                </div>
                <div className={'balanceBar__labels__infavorVotes'}>
                    {PrecisionNumbers({
                        amount: props.infavorVotes,
                        token: TokenSettings('TG'),
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                    {' '}
                    in favor
                </div>
            </div>
        </div>
    );
}

export default BalanceBar;
