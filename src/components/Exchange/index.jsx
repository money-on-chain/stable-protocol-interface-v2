import { Input, Radio, Space } from 'antd';
import React, { useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

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
    isMintOperation,
    executionFeeMap
} from '../../helpers/exchange';

import settings from '../../settings/settings.json';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { AuthenticateContext } from '../../context/Auth';
// import InputAmount from '../InputAmount';
import InputAmount from '../InputAmount/indexInput';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import CheckStatus from '../../helpers/checkStatus';

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

    const [commissionFeeToken, setCommissionFeeToken] = useState('0.0');
    const [commissionPercentFeeToken, setCommissionPercentFeeToken] = useState('0.0');

    const [executionFee, setExecutionFee] = useState(new BigNumber(0));

    const [exchangingUSD, setExchangingUSD] = useState(new BigNumber(0));

    const [inputValidationErrorText, setInputValidationErrorText] = useState('');
    const [inputValidationError, setInputValidationError] = useState(false);

    const IS_MINT = isMintOperation(currencyYouExchange, currencyYouReceive);

    const [radioSelectFee, setRadioSelectFee] = useState(0);
    const [radioSelectFeeTokenDisabled, setRadioSelectFeeTokenDisabled] = useState(true);

    const { isValid, errorType } = CheckStatus();

    const [ valueExchange, setValueExchange ] = useState('');
    const [ valueReceive, setValueReceive ] = useState('');

    useEffect(() => {
        if (amountYouExchange && auth.contractStatusData) {
            onValidate();
        }
    }, [amountYouExchange]);

    const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
        onClear();
        setCurrencyYouExchange(newCurrencyYouExchange);
        setCurrencyYouReceive(tokenReceive(newCurrencyYouExchange)[0]);
    };

    const onChangeCurrencyYouReceive = (newCurrencyYouReceive) => {
        onClear();
        setCurrencyYouReceive(newCurrencyYouReceive);
    };
    const handleSwapCurrencies = () => {
        const tempCurrency = currencyYouExchange;
        setCurrencyYouExchange(currencyYouReceive);
        setCurrencyYouReceive(tempCurrency);
        
        const tempAmount = amountYouExchange;
        setAmountYouExchange(amountYouReceive);
        setAmountYouReceive(tempAmount);

        const tempInputExchange = valueExchange;
        setValueExchange(valueReceive);
        setValueReceive(tempInputExchange);
    };
    const onClear = () => {
        setAmountYouExchange(new BigNumber(0));
        setAmountYouReceive(new BigNumber(0));
        setValueExchange('');
        setValueReceive('');
        setInputValidationError(false);
        setInputValidationErrorText('');
    };

    const onValidate = () => {
        // Protocol in not-good status
        if (!isValid && errorType === '1') {
            if (!currencyYouExchange.startsWith('TP') && currencyYouReceive !== 'TC') {
                setInputValidationErrorText('Not Operational due to low Global Coverage ratio');
                setInputValidationError(true);
                return
            }
        }
        if (!isValid && errorType > 1 && errorType < 5) {
            setInputValidationErrorText('Cannot operate with the current status');
            setInputValidationError(true);
            return
        }
        if (!isValid && errorType === '5') {
            setInputValidationErrorText('Request timeout');
            setInputValidationError(true);
            return
        }

        // 0. Not Wallet connected
        if (!auth.userBalanceData) {
            setInputValidationErrorText('Please connect your wallet');
            setInputValidationError(true);
            return
        }

        // 0. Cannot operate
        if (!auth.contractStatusData?.canOperate) {
            setInputValidationErrorText('Cannot operate with the current contract status');
            setInputValidationError(true);
            return
        }

        // 0. Amount > 0
        if (amountYouExchange.lte(0) || amountYouReceive.lte(0)) {
            if (valueExchange !== '' || valueReceive !== '') {
                setInputValidationErrorText('Amount must be greater than zero');
                setInputValidationError(true);
                return
            }
        }
        if (amountYouExchange.toString() === 'NaN' || amountYouReceive.toString() === 'NaN') {
            setInputValidationErrorText('Amount must be greater than zero');
            setInputValidationError(true);
            return
        }

        // 1. User Exchange Token Validation
        const totalBalance = new BigNumber(
            fromContractPrecisionDecimals(
                TokenBalance(auth, currencyYouExchange),
                TokenSettings(currencyYouExchange).decimals
            )
        );

        if (amountYouExchange.gt(totalBalance)) {
            setInputValidationErrorText('Not enough balance in your wallet');
            setInputValidationError(true);
            return
        }

        let tIndex
        // 2. MINT TP. User receive available token in contract
        const arrCurrencyYouReceive = currencyYouReceive.split('_')
        if (arrCurrencyYouReceive[0] === 'TP') {
            // There are sufficient PEGGED in the contracts to mint?
            tIndex = TokenSettings(currencyYouReceive).key
            const tpAvailableToMint = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.getTPAvailableToMint[tIndex],
                    settings.tokens.TP[tIndex].decimals
                )
            );
            if (new BigNumber(amountYouReceive).gt(tpAvailableToMint)) {
                setInputValidationErrorText('Not enough liquidity in the protocol');
                setInputValidationError(true);
                return
            }
        }

        // 3. REDEEM TC
        if (currencyYouExchange === 'TC') {
            // There are sufficient TC in the contracts to redeem?
            const tcAvailableToRedeem = new BigNumber(
                Web3.utils.fromWei(auth.contractStatusData.getTCAvailableToRedeem, "ether")
            );
            if (new BigNumber(amountYouExchange).gt(tcAvailableToRedeem)) {
                setInputValidationErrorText('Not enough liquidity in the protocol');
                setInputValidationError(true);
                return
            }
        }

        // 4. REDEEM SUFFICIENT CA IN THE CONTRACT?
        if (arrCurrencyYouReceive[0] === 'CA') {

            tIndex = TokenSettings(currencyYouReceive).key
            // There are sufficient CA in the contract
            const caBalance = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.getACBalance[tIndex],
                    settings.tokens.CA[tIndex].decimals
                )
            );
            if (new BigNumber(amountYouReceive).gt(caBalance)) {
                setInputValidationErrorText(`Not enough liquidity in the protocol`);
                setInputValidationError(true);
                return                
            }
        }

        // 5. HAVE TO PAY COMMISSIONS WITH FEE TOKEN?
        const feeTokenBalance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.FeeToken.balance,
                settings.tokens.TF.decimals
            )
        );

        if (feeTokenBalance.gt(commissionFeeToken)) {
            // Set as default to pay fee with token
            setRadioSelectFeeTokenDisabled(false)
        } else {
            setRadioSelectFeeTokenDisabled(true)
        }

        // 6. MINT TP. Flux capacitor maxQACToMintTP
        if (arrCurrencyYouReceive[0] === 'TP') {
            tIndex = TokenSettings(currencyYouReceive).key
            const maxQACToMintTP = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.maxQACToMintTP,
                    settings.tokens.TP[tIndex].decimals
                )
            );
            console.log("maxQACToMintTP: ", maxQACToMintTP.toString())
            console.log("amountYouExchange: ", new BigNumber(amountYouExchange).toString())
            if (new BigNumber(amountYouExchange).gt(maxQACToMintTP)) {
                setInputValidationErrorText('Maximum temporarily limited by the protocol');
                setInputValidationError(true);
                return
            }
        }

        // 7. Redeem TP. Flux capacitor maxQACToRedeemTP
        const arrCurrencyYouExchange = currencyYouExchange.split('_')
        if (arrCurrencyYouExchange[0] === 'TP') {
            tIndex = TokenSettings(currencyYouReceive).key
            const maxQACToRedeemTP = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.maxQACToRedeemTP,
                    settings.tokens.TP[tIndex].decimals
                )
            );
            console.log("maxQACToRedeemTP: ", maxQACToRedeemTP.toString())
            console.log("amountYouReceive: ", new BigNumber(amountYouReceive).toString())
            if (new BigNumber(amountYouReceive).gt(maxQACToRedeemTP)) {
                setInputValidationErrorText('Maximum temporarily limited by the protocol');
                setInputValidationError(true);
                return
            }
        }

        // No Validations Errors
        setInputValidationErrorText('');
        setInputValidationError(false);

    };

    const onChangeAmounts = (amountExchange, amountReceive, source) => {
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
                const amountFormattedReceive = AmountToVisibleValue(
                    amountReceiveFee,
                    currencyYouReceive,
                    3,
                    false
                );
                setValueReceive(amountFormattedReceive);
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
                const amountFormattedExchange = AmountToVisibleValue(
                    amountExchangeFee,
                    currencyYouExchange,
                    3,
                    false
                );
                setAmountYouExchange(amountExchangeFee);
                setValueExchange(amountFormattedExchange);
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

        // Commission
        setCommission(infoFee.fee);
        setCommissionPercent(infoFee.percent);

        // Fee Token Commission
        setCommissionFeeToken(infoFee.totalFeeToken);
        setCommissionPercentFeeToken(infoFee.feeTokenPercent);

        const priceCA = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_CA[0],
                settings.tokens.CA[0].decimals
            )
        );
        convertAmountUSD = convertAmountUSD.times(priceCA);
        setExchangingUSD(convertAmountUSD);

        // Execution fee load
        setExecutionFee(
            new BigNumber(
                fromContractPrecisionDecimals(
                    executionFeeMap(currencyYouExchange, currencyYouReceive, auth),
                    settings.tokens.COINBASE.decimals
                )
            )
        )

    };

    const onChangeAmountYouExchange = (newAmount) => {
        if (newAmount < 0) {
            setAmountYouExchange(new BigNumber(0));
            setAmountYouReceive(new BigNumber(0));
            setExchangingUSD(new BigNumber(0));
            setValueExchange('0.0');
        } else {
            setValueExchange(newAmount);
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
        }
    };

    const onChangeAmountYouReceive = (newAmount) => {
        if (newAmount < 0) {
            setAmountYouExchange(new BigNumber(0));
            setAmountYouReceive(new BigNumber(0));
            setExchangingUSD(new BigNumber(0));
            setValueReceive('0.0');
        } else {
            setValueReceive(newAmount);
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
        }
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
        setValueExchange(totalYouExchange.toFixed(3));
        setAmountYouExchange(totalYouExchange);
        onChangeAmounts(
            new BigNumber(totalYouExchange),
            convertAmountReceive,
            'exchange'
        );
    };

    const onChangeFee = (e) => {
        console.log('radio checked', e.target.value);
        setRadioSelectFee(e.target.value);
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
                        inputValue={valueExchange}
                        placeholder={'0.0'}
                        onValueChange={onChangeAmountYouExchange}
                        validateError={false}
                        balance={
                            (!auth.contractStatusData?.canOperate) ? '--' : PrecisionNumbers({
                                amount: TokenBalance(auth, currencyYouExchange),
                                token: TokenSettings(currencyYouExchange),
                                decimals:
                                TokenSettings(currencyYouExchange)
                                    .visibleDecimals,
                                t: t,
                                i18n: i18n,
                                ns: ns
                            })
                        }
                        setAddTotalAvailable={setAddTotalAvailable}
                        action={t('exchange.labelSending')}
                        balanceText={t('exchange.labelBalance')}
                    />
                    <div className="input-validation-error">{inputValidationErrorText}</div>
                </div>

                <div className="swap-arrow" onClick={handleSwapCurrencies}>
                    <i className="icon-swap"></i>
                </div>

                <div className="swap-to">
                    <SelectCurrency
                        className="select-token"
                        value={currencyYouReceive}
                        currencyOptions={tokenReceive(currencyYouExchange)}
                        onChange={onChangeCurrencyYouReceive}
                    />

                    <InputAmount
                        inputValue={valueReceive}
                        placeholder={'0.0'}
                        onValueChange={onChangeAmountYouReceive}
                        validateError={false}
                        isDirty={isDirtyYouReceive}
                        balance={(!auth.contractStatusData?.canOperate) ? '--' : PrecisionNumbers({
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
                        setAddTotalAvailable={setAddTotalAvailable}
                        action={t('exchange.labelReceiving')}
                        balanceText={t('exchange.labelUpTo')}
                    />
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
                            {(!auth.contractStatusData?.canOperate) ? '--' : PrecisionNumbers({
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
                            {(!auth.contractStatusData?.canOperate) ? '--' : PrecisionNumbers({
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
                        <div className={'radio-fee'}>
                            <Radio.Group onChange={onChangeFee} value={radioSelectFee}>
                                <Space direction="vertical">
                                    <Radio value={0} >
                                        <span className={'token_exchange'}>
                                {t('fees.labelFee')} (
                                            {(!auth.contractStatusData?.canOperate) ? '--' : PrecisionNumbers({
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
                                {(!auth.contractStatusData?.canOperate) ? '--' : PrecisionNumbers({
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
                                    </Radio>
                                    <Radio value={1} disabled={radioSelectFeeTokenDisabled}>
                                        <span className={'token_exchange'}>
                                        {t('fees.labelFee')} (
                                                {(!auth.contractStatusData?.canOperate) ? '--' : PrecisionNumbers({
                                                    amount: new BigNumber(commissionPercentFeeToken),
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
                                            {(!auth.contractStatusData?.canOperate) ? '--' : PrecisionNumbers({
                                                amount: new BigNumber(commissionFeeToken),
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
                                            {t(
                                                `exchange.tokens.TF.abbr`,
                                                { ns: ns }
                                            )}
                                        </span>
                                    </Radio>
                                </Space>
                            </Radio.Group>
                        </div>


                    </div>
                    <div className="balance">
                        {t('fees.disclaimer1')} <br />
                        {t('fees.disclaimer2')}
                    </div>
                </div>

            </div>
        </div>

        <div className="exchange-footer">

            <div className="exchanging">

                <span className={'token_exchange'}>{t('exchange.exchangingSummary')} </span>
                <span className={'symbol'}> ≈ </span>
                {exchangingUSD.toString() !== 'NaN' ? <span className={'token_receive'}>
                    {(!auth.contractStatusData?.canOperate) ? '--' : PrecisionNumbers({
                        amount: exchangingUSD,
                        token: TokenSettings('CA_0'),
                        decimals: 2,
                        t: t,
                        i18n: i18n,
                        ns: ns,
                        skipContractConvert: true
                    })}
                </span> : <span>0</span>}
                <span className={'token_receive_name'}> {t('exchange.exchangingCurrency')}</span>

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
                    inputValidationError={inputValidationError}
                    executionFee={executionFee}
                    commissionFeeToken={commissionFeeToken}
                    commissionPercentFeeToken={commissionPercentFeeToken}
                    radioSelectFee={radioSelectFee}
                    //amountYouExchangeFee={amountYouExchangeFee}
                    //amountYouReceiveFee={amountYouReceiveFee}
                />

            </div>

        </div>
    </div>
    );
}
