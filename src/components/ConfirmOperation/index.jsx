import BigNumber from 'bignumber.js';
import React, { useContext, useState, useEffect } from 'react';
import {Collapse, Slider} from "antd";

import {useProjectTranslation} from "../../helpers/translations";
import IconStatusPending from "../../assets/icons/status-pending.png";
import IconStatusSuccess from "../../assets/icons/status-success.png";
import IconStatusError from "../../assets/icons/status-error.png";
import { PrecisionNumbers } from '../PrecisionNumbers';
import { ConvertAmount, TokenSettings } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import { isMintOperation } from '../../helpers/exchange';


const { Panel } = Collapse;

export default function ConfirmOperation(props) {

    const {
        currencyYouExchange,
        currencyYouReceive,
        exchangingUSD,
        commission,
        commissionPercent,
        amountYouExchangeFee,
        amountYouReceiveFee
    } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const [status, setStatus] = useState('SUBMIT');
    const [tolerance, setTolerance] = useState(0.1);

    const IS_MINT = isMintOperation(currencyYouExchange, currencyYouReceive)

    const toleranceLimits = (newTolerance) => {
        let limitExchange
        let limitReceive
        if (IS_MINT) {
            limitExchange = new BigNumber(amountYouExchangeFee).times(new BigNumber(newTolerance)).div(100).plus(new BigNumber(amountYouExchangeFee))
            limitReceive = amountYouReceiveFee
        } else {
            limitExchange = amountYouExchangeFee
            limitReceive = new BigNumber(amountYouReceiveFee).times(new BigNumber(newTolerance)).div(100).minus(new BigNumber(amountYouReceiveFee)).abs()
        }

        const limits = {
            exchange: limitExchange,
            receive: limitReceive
        }

        return limits
    };

    const limits = toleranceLimits(tolerance)

    const [amountYouExchangeFeeLimit, setAmountYouExchangeFeeLimit] = useState(limits.exchange);
    const [amountYouReceiveFeeLimit, setAmountYouReceiveFeeLimit] = useState(limits.receive);

    let sentIcon = '';
    let statusLabel = '';
    switch (status) {
        case 'SUBMIT':
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = 'Wait for transaction confirmation';
            break;
        case 'WAITING':
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = 'Wait for transaction confirmation';
            break;
        case 'SUCCESS':
            sentIcon = 'icon-tx-success';
            statusLabel = 'Operation Successful';
            break;
        case 'ERROR':
            sentIcon = 'icon-tx-error';
            statusLabel = 'Operation Failed!';
            break;
        default:
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = 'Wait for transaction confirmation';
    }

    const markStyle = {
        style: {
            color: '#707070',
            fontSize: 10
        }
    };

    const priceVariationToleranceMarks = {
        0: { ...markStyle, label: '0.0%' },
        1: { ...markStyle, label: '1%' },
        2: { ...markStyle, label: '2%' },
        5: { ...markStyle, label: '5%' },
        10: { ...markStyle, label: '10%' }
    };

    const changeTolerance = (newTolerance) => {
        setTolerance(newTolerance);
        const limits = toleranceLimits(newTolerance)
        setAmountYouExchangeFeeLimit(limits.exchange)
        setAmountYouReceiveFeeLimit(limits.receive)
    };

    return (
        <div className="confirm-operation">
            <div className="exchange">
                <div className="swapFrom">
                    <span className="value">
                        {PrecisionNumbers({
                            amount: new BigNumber(amountYouExchangeFee),
                            token: TokenSettings(currencyYouExchange),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                        {IS_MINT && (<span className="limitWarning">Up to
                            <span> {PrecisionNumbers({
                                amount: new BigNumber(amountYouExchangeFeeLimit),
                                token: TokenSettings(currencyYouExchange),
                                decimals: 2,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })} </span>
                            (see price variation tolerance)
                        </span>
                        )}
                    </span>
                    <span className="token"> {t(`exchange.tokens.${currencyYouExchange}.abbr`, { ns: ns })} </span>
                </div>

                <div className="swapArrow">
                    <i className="icon-arrow-down"></i>
                </div>

                <div className="swapTo">
                    <span className="value">
                        {PrecisionNumbers({
                            amount: new BigNumber(amountYouReceiveFee),
                            token: TokenSettings(currencyYouReceive),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                        {!IS_MINT && (<span className="limitWarning">Minimum
                            <span> {PrecisionNumbers({
                                amount: new BigNumber(amountYouReceiveFeeLimit),
                                token: TokenSettings(currencyYouReceive),
                                decimals: 2,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })} </span>
                            (see price variation tolerance)
                        </span>
                        )}
                    </span>
                    <span className="token"> {t(`exchange.tokens.${currencyYouReceive}.abbr`, { ns: ns })} </span>
                </div>
            </div>

            <div className="prices">
                <div className="rate_1">
                    <span className={'token_exchange'}> 1 {t(`exchange.tokens.${currencyYouExchange}.abbr`, { ns: ns })}</span>
                    <span className={'symbol'}> ≈ </span>
                    <span className={'token_receive'}> {PrecisionNumbers({
                            amount: ConvertAmount(auth, currencyYouExchange, currencyYouReceive, 1, false),
                            token: TokenSettings(currencyYouExchange),
                            decimals: 6,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </span>
                    <span className={'token_receive_name'}> {t(`exchange.tokens.${currencyYouReceive}.abbr`, { ns: ns })} </span>
                </div>
                <div className="rate_2">
                    <span className={'token_exchange'}> 1 {t(`exchange.tokens.${currencyYouReceive}.abbr`, { ns: ns })}</span>
                    <span className={'symbol'}> ≈ </span>
                    <span className={'token_receive'}> {PrecisionNumbers({
                            amount: ConvertAmount(auth, currencyYouReceive, currencyYouExchange, 1, false),
                            token: TokenSettings(currencyYouReceive),
                            decimals: 6,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </span>
                    <span className={'token_receive_name'}> {t(`exchange.tokens.${currencyYouExchange}.abbr`, { ns: ns })} </span>
                </div>
            </div>

            <div className="separator"></div>

            <div className="fees">
                <div className="value">
                    <span className={'token_exchange'}>Fee (
                        {PrecisionNumbers({
                            amount: new BigNumber(commissionPercent),
                            token: TokenSettings(currencyYouExchange),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                        %)
                        </span>
                    <span className={'symbol'}> ≈ </span>
                    <span className={'token_receive'}>
                            {PrecisionNumbers({
                                amount: new BigNumber(commission),
                                token: TokenSettings(currencyYouExchange),
                                decimals: 3,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })}
                        </span>
                    <span className={'token_receive_name'}> {t(`exchange.tokens.${currencyYouExchange}.abbr`, { ns: ns })} </span>
                </div>
                <div className="disclaimer">
                    This fee will be deducted from the transaction value transferred.<br/>
                    Amounts my be different at transaction confirmation.
                </div>
            </div>

            <div className="separator"></div>

            { status === 'SUBMIT' && <div className="tx-submit">

                <div className="customize-tolerance">
                    <Collapse accordion className="CollapseTolerance">
                        <Panel showArrow={false} header={<div className="PriceVariationSetting"><i className="icon-wheel"></i><span className="SliderText">Customize price variation tolerance</span></div>} key="1">
                            <div className="PriceVariationContainer">
                                <Slider
                                    className="SliderControl"
                                    marks={priceVariationToleranceMarks}
                                    defaultValue={tolerance}
                                    min={0}
                                    max={10}
                                    step={0.1}
                                    dots={false}
                                    onChange={val => changeTolerance(val)}
                                />
                            </div>
                        </Panel>
                    </Collapse>

                </div>

                <div className="cta">
                    <span className="exchanging">
                        <span className={'token_exchange'}>Exchanging </span>
                        <span className={'symbol'}> ≈ </span>
                        <span className={'token_receive'}>
                            {PrecisionNumbers({
                                amount: new BigNumber(exchangingUSD),
                                token: TokenSettings('CA_0'),
                                decimals: 2,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })}
                        </span>
                        <span className={'token_receive_name'}> USD</span>
                    </span>
                    <button type="primary" className="btn">Send transaction</button>
                </div>

            </div>
            }

            { (status === 'WAITING' || status === 'SUCCESS' || status === 'ERROR')  && <div className="tx-sent">

                <div className="status">

                    <div className="transaction-id">
                        <div className="label">Transaction ID</div>
                        <div className="address-section">
                            <span className="address">oxba8cd957…72ad</span>
                            <i className="icon-copy"></i>
                        </div>
                    </div>

                    <div className="tx-logo-status">
                        <i className={sentIcon}></i>
                    </div>

                    <div className="status-label">
                        {statusLabel}
                    </div>

                    <button type="primary" className="btnClose">Close</button>

                </div>

            </div>}



        </div>
    )
}