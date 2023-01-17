
import { Switch, Button } from 'antd';
import React, { useContext, useState, useEffect } from 'react';

import {useProjectTranslation} from "../../helpers/translations";
import SelectCurrency from "../SelectCurrency";
import ModalConfirmOperation from "../Modals/ConfirmOperation";
import {
    TokenSettings,
    TokenBalance,
    ConvertBalance,
    ConvertAmount,
    AmountToVisibleValue,
    CalcCommission,
    AmountsWithCommissions } from '../../helpers/currencies';
import { tokenExchange, tokenReceive, isMintOperation } from '../../helpers/exchange';

import settings from '../../settings/settings.json'
import { PrecisionNumbers } from '../PrecisionNumbers';
import { AuthenticateContext } from '../../context/Auth';
import InputAmount from './InputAmount';
import BigNumber from 'bignumber.js';


export default function Exchange() {

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const defaultTokenExchange = tokenExchange()[0]
    const defaultTokenReceive = tokenReceive(defaultTokenExchange)[0]

    const [currencyYouExchange, setCurrencyYouExchange] = useState(defaultTokenExchange);
    const [currencyYouReceive, setCurrencyYouReceive] = useState(defaultTokenReceive);

    const [amountYouExchange, setAmountYouExchange] = useState('0.0');
    const [amountYouReceive, setAmountYouReceive] = useState('0.0');

    const [commission, setCommission] = useState('0.0');
    const [commissionPercent, setCommissionPercent] = useState('0.0');

    const [amountYouExchangeFee, setAmountYouExchangeFee] = useState('0.0');
    const [amountYouReceiveFee, setAmountYouReceiveFee] = useState('0.0');

    const [exchangingUSD, setExchangingUSD] = useState('0.0');

    useEffect(() => {
        setAmountYouExchange(amountYouExchange);
    }, [amountYouExchange]);

    useEffect(() => {
        setAmountYouReceive(amountYouReceive);
    }, [amountYouReceive]);

    const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
        setCurrencyYouExchange(newCurrencyYouExchange);
        setCurrencyYouReceive(tokenReceive(newCurrencyYouExchange)[0])
        onChangeAmountYouReceive(0.0)
        onChangeAmountYouExchange(0.0)
    };

    const onChangeCurrencyYouReceive = (newCurrencyYouReceive) => {
        setCurrencyYouReceive(newCurrencyYouReceive);
        onChangeAmountYouReceive(0.0)
        onChangeAmountYouExchange(0.0)
    };

    const onChangeAmounts = (amountExchange, amountReceive) => {

        // Set commissions
        const infoFee = CalcCommission(auth, currencyYouExchange, currencyYouReceive, amountExchange, amountReceive, false)
        setCommission(infoFee.fee)
        setCommissionPercent(infoFee.percent)

        // Set exchanging total in USD
        let convertAmountUSD
        if (isMintOperation(currencyYouExchange, currencyYouReceive)) {
            convertAmountUSD = ConvertAmount(auth, currencyYouExchange, 'CA_0', amountExchange, false)
        } else {
            convertAmountUSD = ConvertAmount(auth, currencyYouExchange, 'CA_0', amountReceive, false)
        }
        setExchangingUSD(convertAmountUSD.plus(infoFee.fee).toString())

        // Set amounts with fee
        const amountsWithFee = AmountsWithCommissions(auth, currencyYouExchange, currencyYouReceive, amountExchange, amountReceive, infoFee.fee, false)
        setAmountYouExchangeFee(amountsWithFee.amountYouExchange)
        setAmountYouReceiveFee(amountsWithFee.amountYouReceive)

    };

    const onChangeAmountYouExchange = (newAmount) => {
        const convertAmountReceive = ConvertAmount(auth, currencyYouExchange, currencyYouReceive, newAmount, false)
        setAmountYouReceive(AmountToVisibleValue(convertAmountReceive, currencyYouExchange, 3, false))
        onChangeAmounts(newAmount, convertAmountReceive)
    };

    const onChangeAmountYouReceive = (newAmount) => {
        const convertAmountExchange = ConvertAmount(auth, currencyYouReceive, currencyYouExchange, newAmount, false)
        setAmountYouExchange(AmountToVisibleValue(convertAmountExchange, currencyYouReceive, 3, false))
        onChangeAmounts(convertAmountExchange, newAmount)
    };

    const setAddTotalAvailable = () => {
        const totalYouExchange = TokenBalance(auth, currencyYouExchange)
        const convertA = ConvertAmount(auth, currencyYouExchange, currencyYouReceive, totalYouExchange, true)
        setAmountYouReceive(AmountToVisibleValue(convertA, currencyYouExchange, 3, false))
        setAmountYouExchange(AmountToVisibleValue(totalYouExchange, currencyYouReceive, 3, true))
    };

    return (
    <div className="exchange-content">
        <div className="fields">
            <div className="swap-from">

                <SelectCurrency
                    className="select-token"
                    value={currencyYouExchange}
                    currencyOptions={tokenExchange()}
                    onChange={onChangeCurrencyYouExchange}
                />

                <InputAmount
                    InputValue={amountYouExchange}
                    placeholder={'0.00'}
                    onValueChange={onChangeAmountYouExchange}
                    validateError={false}
                />

                <div className="token-balance">
                    <span className="token-balance-value">
                        Balance: {PrecisionNumbers({
                                    amount: TokenBalance(auth, currencyYouExchange),
                                    token: TokenSettings(currencyYouExchange),
                                    decimals: TokenSettings(currencyYouExchange).visibleDecimals,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}
                    </span>
                    <a href="#" className="token-balance-add-total" onClick={setAddTotalAvailable}>Add total available</a>

                </div>

            </div>

            <div className="swap-arrow">
                <i className="icon-swap-arrow"></i>
            </div>

            <div className="swap-to">

                <SelectCurrency
                    className="select-token"
                    value={currencyYouReceive}
                    currencyOptions={tokenReceive(currencyYouExchange)}
                    onChange={onChangeCurrencyYouReceive}
                />

                <InputAmount
                    InputValue={amountYouReceive}
                    placeholder={'0.00'}
                    onValueChange={onChangeAmountYouReceive}
                    validateError={false}
                />

                <div className="token-balance">
                    <span className="token-balance-value">
                        Max: {PrecisionNumbers({
                        amount: ConvertBalance(auth, currencyYouExchange, currencyYouReceive),
                        token: TokenSettings(currencyYouReceive),
                        decimals: TokenSettings(currencyYouReceive).visibleDecimals,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                    </span>
                    <a href="#" className="token-balance-add-total" onClick={setAddTotalAvailable}>Add total available</a>
                </div>


            </div>

        </div>

        <div className="info">
            <div className="prices">
                <div className="conversion_0">
                    <span className={'token_exchange'}> 1 {t(`exchange.tokens.${currencyYouExchange}.abbr`, { ns: ns })}</span>
                    <span className={'symbol'}> ≈ </span>
                    <span className={'token_receive'}> {PrecisionNumbers({
                            amount: ConvertAmount(auth, currencyYouExchange, currencyYouReceive, 1, false),
                            token: TokenSettings(currencyYouExchange),
                            decimals: 3,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                        </span>
                    <span className={'token_receive_name'}> {t(`exchange.tokens.${currencyYouReceive}.abbr`, { ns: ns })} </span>
                </div>
                <div className="conversion_1">
                    <span className={'token_exchange'}> 1 {t(`exchange.tokens.${currencyYouReceive}.abbr`, { ns: ns })}</span>
                    <span className={'symbol'}> ≈ </span>
                    <span className={'token_receive'}> {PrecisionNumbers({
                            amount: ConvertAmount(auth, currencyYouReceive, currencyYouExchange, 1, false),
                            token: TokenSettings(currencyYouReceive),
                            decimals: 3,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </span>
                    <span className={'token_receive_name'}> {t(`exchange.tokens.${currencyYouExchange}.abbr`, { ns: ns })} </span>


                </div>
            </div>

            <div className="fees">
                <div className="frame">
                    <div className="frame-t">
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
                        <span className={'token_receive_name'}> {t(`exchange.tokens.${currencyYouExchange}.abbr`, { ns: ns })}</span>
                    </div>

                    {/*<div className="switch">*/}
                    {/*    <Switch*/}
                    {/*        disabled={false}*/}
                    {/*        checked={false}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
                <div className="balance">
                    This fee will be deducted from the transaction value transferred. Amounts my be different at transaction confirmation.
                </div>

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

                <ModalConfirmOperation
                    currencyYouExchange={currencyYouExchange}
                    currencyYouReceive={currencyYouReceive}
                    exchangingUSD={exchangingUSD}
                    commission={commission}
                    commissionPercent={commissionPercent}
                    amountYouExchangeFee={amountYouExchangeFee}
                    amountYouReceiveFee={amountYouReceiveFee}
                />

            </div>
        </div>

    </div>
    )
}