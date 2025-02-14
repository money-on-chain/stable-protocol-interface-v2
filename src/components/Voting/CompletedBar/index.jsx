import React from 'react';
import PropTypes from 'prop-types';

import './Styles.scss';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import { TokenSettings } from '../../../helpers/currencies';
import { useProjectTranslation } from '../../../helpers/translations';


function CompletedBar(props) {
    const {i18n} = useProjectTranslation();
    const space = '\u00A0';

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

            <div className="extraData__container">
                {props.label1 != null && (
                    <div className="dataItem">
                        {props.label1}:{space}
                        {PrecisionNumbers({
                            amount: props.amount1,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            i18n: i18n,
                            skipContractConvert: true
                        })}
                        {space}(
                        {PrecisionNumbers({
                            amount: props.percentage1,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            i18n: i18n,
                            skipContractConvert: true
                        })}
                        %)
                    </div>
                )}
                {props.label2 != null && (
                    <div className="dataItem">
                        {props.label2}:{space}
                        {PrecisionNumbers({
                            amount: props.amount2,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            i18n: i18n,
                            skipContractConvert: true
                        })}
                        {space}(
                        {PrecisionNumbers({
                            amount: props.percentage2,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            i18n: i18n,
                            skipContractConvert: true
                        })}
                        %)
                    </div>
                )}
                {props.label3 != null && (
                    <div className="dataItem">
                        {props.label3}:{space}
                        {PrecisionNumbers({
                            amount: props.amount3,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            i18n: i18n,
                            skipContractConvert: true
                        })}
                        {space}(
                        {PrecisionNumbers({
                            amount: props.percentage3,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            i18n: i18n,
                            skipContractConvert: true
                        })}
                        %)
                    </div>
                )}
            </div>
            {/* 
            <div className="CompletedBar__labels__container">
                <div className="extraData">
                    {props.labelCurrent}:{space}
                    {PrecisionNumbers({
                        amount: props.valueCurrent,
                        token: TokenSettings('TG'),
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                    {space}(
                    {PrecisionNumbers({
                        amount: props.pctCurrent,
                        token: TokenSettings('TG'),
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                    %)
                </div>
                {props.labelNeedIt != null && (
                    <div className="extraData">
                        {props.labelNeedIt}:{space}
                        {PrecisionNumbers({
                            amount: props.valueNeedIt,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                        {space}(
                        {PrecisionNumbers({
                            amount: props.pctNeedIt,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                        %)
                    </div>
                )}
                {props.labelTotal != null && (
                    <div className="extraData">
                        {props.labelTotal}:{space}
                        {PrecisionNumbers({
                            amount: props.valueTotal,
                            token: TokenSettings('TG'),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                        {space}(100%)
                    </div>
                )}
            </div> */}
        </div>
    );
}

export default CompletedBar;


CompletedBar.propTypes = {
    description: PropTypes.string,
    type: PropTypes.number,
    percentage: PropTypes.number,
    needed: PropTypes.number,
    label1: PropTypes.number,
    amount1: PropTypes.number,
    percentage1: PropTypes.number,
    label2: PropTypes.number,
    amount2: PropTypes.number,
    percentage2: PropTypes.number,
    label3: PropTypes.number,
    amount3: PropTypes.number,
    percentage3: PropTypes.number
};
