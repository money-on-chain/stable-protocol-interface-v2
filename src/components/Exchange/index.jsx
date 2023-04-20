import { Switch, Button } from 'antd';
import React, { useContext, useState, useEffect } from 'react';

import { useProjectTranslation } from '../../helpers/translations';
import SelectCurrency from '../SelectCurrency';
import ModalConfirmOperation from '../Modals/ConfirmOperation';
import {
    TokenSettings,
    TokenBalance,
    ConvertBalance,
    ConvertAmount,
    AmountToVisibleValue,
    CalcCommission,
    AmountsWithCommissions
} from '../../helpers/currencies';
import {
    tokenExchange,
    tokenReceive,
    isMintOperation
} from '../../helpers/exchange';

import settings from '../../settings/settings.json';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { AuthenticateContext } from '../../context/Auth';
import InputAmount from './InputAmount';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';

export default function Exchange() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const defaultTokenExchange = tokenExchange()[0];
    const defaultTokenReceive = tokenReceive(defaultTokenExchange)[0];

    const [currencyYouExchange, setCurrencyYouExchange] =
        useState(defaultTokenExchange);
    const [currencyYouReceive, setCurrencyYouReceive] =
        useState(defaultTokenReceive);

    const [amountYouExchange, setAmountYouExchange] = useState(
        new BigNumber(0)
    );
    const [amountYouReceive, setAmountYouReceive] = useState(new BigNumber(0));

    const [isDirtyYouExchange, setIsDirtyYouExchange] = useState(false);
    const [isDirtyYouReceive, setIsDirtyYouReceive] = useState(false);

    const [commission, setCommission] = useState('0.0');
    const [commissionPercent, setCommissionPercent] = useState('0.0');

    const [exchangingUSD, setExchangingUSD] = useState(new BigNumber(0));

    const IS_MINT = isMintOperation(currencyYouExchange, currencyYouReceive);

    useEffect(() => {
        setAmountYouExchange(amountYouExchange);
    }, [amountYouExchange]);

    useEffect(() => {
        setAmountYouReceive(amountYouReceive);
    }, [amountYouReceive]);

    const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
        setCurrencyYouExchange(newCurrencyYouExchange);
        setCurrencyYouReceive(tokenReceive(newCurrencyYouExchange)[0]);
        onChangeAmountYouReceive(0.0);
        onChangeAmountYouExchange(0.0);
    };

    const onChangeCurrencyYouReceive = (newCurrencyYouReceive) => {
        setCurrencyYouReceive(newCurrencyYouReceive);
        onChangeAmountYouReceive(0.0);
        onChangeAmountYouExchange(0.0);
    };

    const onClear = () => {
        console.log("Clear button")
    };

    const onChangeAmounts = (amountExchange, amountReceive, source) => {
        // set the other input
        let infoFee;
        let amountExchangeFee;
        let amountReceiveFee;
        switch (source) {
            case 'exchange':
                infoFee = CalcCommission(
                    auth,
                    currencyYouExchange,
                    currencyYouReceive,
                    amountReceive,
                    false
                );
                amountExchangeFee = amountExchange;
                amountReceiveFee = amountReceive.minus(infoFee.fee);
                setAmountYouReceive(amountReceiveFee);
                setAmountYouExchange(amountExchangeFee);
                break;
            case 'receive':
                infoFee = CalcCommission(
                    auth,
                    currencyYouExchange,
                    currencyYouReceive,
                    amountExchange,
                    false
                );
                amountExchangeFee = amountExchange.plus(infoFee.fee);
                amountReceiveFee = amountReceive;
                setAmountYouExchange(amountExchangeFee);
                setAmountYouReceive(amountReceiveFee);
                break;
            default:
                throw new Error('Invalid source name');
        }

        // Set exchanging total in USD
        let convertAmountUSD;
        if (IS_MINT) {
            infoFee = CalcCommission(
                auth,
                currencyYouExchange,
                currencyYouReceive,
                amountExchange,
                false
            );
            convertAmountUSD = amountExchangeFee;
        } else {
            infoFee = CalcCommission(
                auth,
                currencyYouExchange,
                currencyYouReceive,
                amountReceive,
                false
            );
            convertAmountUSD = amountReceiveFee;
        }

        setCommission(infoFee.fee);
        setCommissionPercent(infoFee.percent);
        setExchangingUSD(convertAmountUSD);
    };

    const onChangeAmountYouExchange = (newAmount) => {
        if (newAmount === '0' && amountYouExchange.toString() === '0') {
            setIsDirtyYouExchange(true);
            setIsDirtyYouReceive(true);
        } else {
            setIsDirtyYouExchange(true);
            setIsDirtyYouReceive(false);
        }

        const convertAmountReceive = ConvertAmount(
            auth,
            currencyYouExchange,
            currencyYouReceive,
            newAmount,
            false
        );
        onChangeAmounts(
            new BigNumber(newAmount),
            convertAmountReceive,
            'exchange'
        );
    };

    const onChangeAmountYouReceive = (newAmount) => {
        setIsDirtyYouExchange(false);
        setIsDirtyYouReceive(true);

        const convertAmountExchange = ConvertAmount(
            auth,
            currencyYouReceive,
            currencyYouExchange,
            newAmount,
            false
        );
        onChangeAmounts(
            convertAmountExchange,
            new BigNumber(newAmount),
            'receive'
        );
    };

    const setAddTotalAvailable = () => {
        const tokenSettings = TokenSettings(currencyYouExchange);
        const totalYouExchange = new BigNumber(
            fromContractPrecisionDecimals(
                TokenBalance(auth, currencyYouExchange),
                tokenSettings.decimals
            )
        );
        const convertAmountReceive = ConvertAmount(
            auth,
            currencyYouExchange,
            currencyYouReceive,
            totalYouExchange,
            false
        );

        setAmountYouExchange(totalYouExchange);
        onChangeAmounts(
            new BigNumber(totalYouExchange),
            convertAmountReceive,
            'exchange'
        );
    };

    return (
    <div>
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
                        InputValue={amountYouExchange.toString() === '0' ? 0 : AmountToVisibleValue(
                            amountYouExchange,
                            currencyYouReceive,
                            3,
                            false
                        )}
                        placeholder={'0.0'}
                        onValueChange={onChangeAmountYouExchange}
                        validateError={false}
                        isDirty={isDirtyYouExchange}
                    />

                    <div className="token-balance">
                        <span className="token-balance-value">
                            Balance:{' '}
                            {PrecisionNumbers({
                                amount: TokenBalance(auth, currencyYouExchange),
                                token: TokenSettings(currencyYouExchange),
                                decimals:
                                    TokenSettings(currencyYouExchange)
                                        .visibleDecimals,
                                t: t,
                                i18n: i18n,
                                ns: ns
                            })}
                        </span>
                        <a
                            href="#"
                            className="token-balance-add-total"
                            onClick={setAddTotalAvailable}
                        >
                            Add total available
                        </a>
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
                        InputValue={amountYouReceive.toString() === '0' ? 0 : AmountToVisibleValue(
                            amountYouReceive,
                            currencyYouReceive,
                            3,
                            false
                        )}
                        placeholder={'0.0'}
                        onValueChange={onChangeAmountYouReceive}
                        validateError={false}
                        isDirty={isDirtyYouReceive}
                    />

                    <div className="token-balance">
                        <span className="token-balance-value">
                            Max:{' '}
                            {PrecisionNumbers({
                                amount: ConvertBalance(
                                    auth,
                                    currencyYouExchange,
                                    currencyYouReceive
                                ),
                                token: TokenSettings(currencyYouReceive),
                                decimals:
                                    TokenSettings(currencyYouReceive)
                                        .visibleDecimals,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })}
                        </span>
                        <a
                            href="#"
                            className="token-balance-add-total"
                            onClick={setAddTotalAvailable}
                        >
                            Add total available
                        </a>
                    </div>
                </div>
            </div>

            <div className="info">
                <div className="prices">
                    <div className="conversion_0">
                        <span className={'token_exchange'}>
                            {' '}
                            1{' '}
                            {t(`exchange.tokens.${currencyYouExchange}.abbr`, {
                                ns: ns
                            })}
                        </span>
                        <span className={'symbol'}> ≈ </span>
                        <span className={'token_receive'}>
                            {' '}
                            {PrecisionNumbers({
                                amount: ConvertAmount(
                                    auth,
                                    currencyYouExchange,
                                    currencyYouReceive,
                                    1,
                                    false
                                ),
                                token: TokenSettings(currencyYouExchange),
                                decimals: 6,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })}
                        </span>
                        <span className={'token_receive_name'}>
                            {' '}
                            {t(`exchange.tokens.${currencyYouReceive}.abbr`, {
                                ns: ns
                            })}{' '}
                        </span>
                    </div>
                    <div className="conversion_1">
                        <span className={'token_exchange'}>
                            {' '}
                            1{' '}
                            {t(`exchange.tokens.${currencyYouReceive}.abbr`, {
                                ns: ns
                            })}
                        </span>
                        <span className={'symbol'}> ≈ </span>
                        <span className={'token_receive'}>
                            {' '}
                            {PrecisionNumbers({
                                amount: ConvertAmount(
                                    auth,
                                    currencyYouReceive,
                                    currencyYouExchange,
                                    1,
                                    false
                                ),
                                token: TokenSettings(currencyYouReceive),
                                decimals: 6,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })}
                        </span>
                        <span className={'token_receive_name'}>
                            {' '}
                            {t(`exchange.tokens.${currencyYouExchange}.abbr`, {
                                ns: ns
                            })}{' '}
                        </span>
                    </div>
                </div>

                <div className="fees">
                    <div className="frame">
                        <div className="frame-t">
                            <span className={'token_exchange'}>
                                Fee (
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
                                    decimals: 6,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: true
                                })}
                            </span>
                            <span className={'token_receive_name'}>
                                {' '}
                                {IS_MINT
                                    ? t(
                                          `exchange.tokens.${currencyYouExchange}.abbr`,
                                          { ns: ns }
                                      )
                                    : t(
                                          `exchange.tokens.${currencyYouReceive}.abbr`,
                                          { ns: ns }
                                      )}
                            </span>
                        </div>

                        {/*<div className="switch">*/}
                        {/*    <Switch*/}
                        {/*        disabled={false}*/}
                        {/*        checked={false}*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>
                    <div className="balance">
                        This fee will be deducted from the transaction value
                        transferred. <br />
                        Amounts my be different at transaction confirmation.
                    </div>
                </div>

            </div>
        </div>

        <div className="exchange-footer">

            <div className="exchanging">

                <span className={'token_exchange'}>Exchanging </span>
                <span className={'symbol'}> ≈ </span>
                <span className={'token_receive'}>
                    {PrecisionNumbers({
                        amount: exchangingUSD,
                        token: TokenSettings('CA_0'),
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                </span>
                <span className={'token_receive_name'}> USD</span>

            </div>

            <div className="actions-buttons">

                <ModalConfirmOperation
                    currencyYouExchange={currencyYouExchange}
                    currencyYouReceive={currencyYouReceive}
                    exchangingUSD={exchangingUSD}
                    commission={commission}
                    commissionPercent={commissionPercent}
                    amountYouExchange={amountYouExchange}
                    amountYouReceive={amountYouReceive}
                    onClear={onClear}
                    //amountYouExchangeFee={amountYouExchangeFee}
                    //amountYouReceiveFee={amountYouReceiveFee}
                />

            </div>

        </div>
    </div>
    );
}
