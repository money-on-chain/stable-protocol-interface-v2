import React from 'react';
import './Styles.scss';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import { TokenSettings } from '../../../helpers/currencies';
import { useProjectTranslation } from '../../../helpers/translations';

function CompletedBar(props) {
    const [t, i18n, ns] = useProjectTranslation();

    return (
        <div className="CompletedBar__wrapper">
            {props.description}
            <div className="CompletedBar__container">
                <div
                    className={`gauge ${props.type} ${props.percentage === '100%' ? ' maxvalue' : ''}`}
                    style={{ width: props.percentage }}
                ></div>
                <div
                    className={'needed ' + props.type}
                    style={{
                        position: 'absolute',
                        width: props.needed,
                        zPosition: 100
                    }}
                ></div>
            </div>
            <div className='CompletedBar__labels__container'>
                <div className='currentVotesLabel'>
                    {props.labelCurrent}:
                    {PrecisionNumbers({
                        amount: props.valueCurrent,
                        token: TokenSettings('TG'),
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })} {' '}

                    ( {PrecisionNumbers({
                        amount: props.pctCurrent,
                        token: TokenSettings('TG'),
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}% )
                </div>
                {props.labelNeedIt != null && (

                    <div className='needItVotesLabel'>
                        {props.labelNeedIt}:
                        {PrecisionNumbers({
                            amount: props.valueNeedIt,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}{' '}

                        ( {PrecisionNumbers({
                            amount: props.pctNeedIt,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}% )
                    </div>
                )}
                {props.labelTotal != null && (
                    <div className='totalVotesLabel'>
                        {props.labelTotal}:
                        {PrecisionNumbers({
                            amount: props.valueTotal,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}{' '}
                        ( 100% )
                    </div>
                )}
            </div>
        </div>
    );
}

export default CompletedBar;
