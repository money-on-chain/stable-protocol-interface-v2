import { Button, Input } from 'antd';
import React, { useContext, useState, useEffect } from 'react';

import { useProjectTranslation } from '../../helpers/translations';
import SelectCurrency from '../SelectCurrency';

import {
    TokenSettings,
    TokenBalance,
    AmountToVisibleValue, ConvertAmount
} from '../../helpers/currencies';
import {
    tokenExchange
} from '../../helpers/exchange';
import settings from '../../settings/settings.json';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { AuthenticateContext } from '../../context/Auth';
import InputAmount from '../InputAmount';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import ModalConfirmSend from '../Modals/ConfirmSend';

export default function Send() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const defaultTokenSend = tokenExchange()[0];

    const [currencyYouSend, setCurrencyYouSend] =
        useState(defaultTokenSend);

    const [amountYouSend, setAmountYouSend] = useState(
        new BigNumber(0)
    );
    const [destinationAddress, setDestinationAddress] = useState('');

    const [sendingUSD, setSendingUSD] = useState(new BigNumber(0));

    const [isDirtyYouSend, setIsDirtyYouSend] = useState(false);

    const [inputValidationErrorText, setInputValidationErrorText] = useState('');
    const [inputValidationAddressErrorText, setInputValidationAddressErrorText] = useState('');
    const [inputValidationError, setInputValidationError] = useState(false);

    useEffect(() => {
        setAmountYouSend(amountYouSend);
    }, [amountYouSend]);


    useEffect(() => {
        if (amountYouSend) {
            onValidate();
        }
    }, [amountYouSend]);

    useEffect(() => {
        if (destinationAddress) {
            onValidate();
        }
    }, [destinationAddress]);

    const onChangeCurrencyYouSend = (newCurrencyYouExchange) => {
        onClear();
        setCurrencyYouSend(newCurrencyYouExchange);
    };

    const onClear = () => {
        setIsDirtyYouSend(false);
        setAmountYouSend(new BigNumber(0));
    };

    const onValidate = () => {
        let amountInputError = false
        let addressInputError = false

        // 1. User Send Token Validation
        const totalBalance = new BigNumber(
            fromContractPrecisionDecimals(
                TokenBalance(auth, currencyYouSend),
                TokenSettings(currencyYouSend).decimals
            )
        );
        console.log('amount you send', amountYouSend.toString());
        if (amountYouSend.gt(totalBalance)) {
            setInputValidationErrorText(t('send.infoNoBalance'));
            amountInputError = true
        }
        if (amountYouSend.eq(0)) {
            amountInputError = true
        }
        if (amountYouSend.lt(0)) {
            setInputValidationErrorText(t('send.infoNoNegativeValues'));
            amountInputError = true
        }
        if (amountYouSend.toString() === 'NaN') {
            setInputValidationErrorText(t('send.infoNoNegativeValues'));
            amountInputError = true
        }
        // 2. Input address valid
        if (destinationAddress === '') {
            addressInputError = true
        } else if (destinationAddress.length < 42 || destinationAddress.length > 42) {
            setInputValidationAddressErrorText(t('send.infoAddressInvalid'));
            addressInputError = true
        }

        if (!amountInputError) {
            setInputValidationErrorText('');
        }

        if (!addressInputError) {
            setInputValidationAddressErrorText('');
        }

        if (amountInputError || addressInputError) {
            setInputValidationError(true);
        } else {
            setInputValidationError(false);
        }

    };

    const onChangeAmountYouSend = (newAmount, isPriceOnly = false) => {
        if (newAmount < 0 || newAmount === '') {
            newAmount = 0;
            setAmountYouSend(new BigNumber(0));
        }
        else {
            const newAmountBig = new BigNumber(newAmount);
            if (!isPriceOnly){
                setIsDirtyYouSend(true);
                setAmountYouSend(newAmountBig);
            }

            const convertAmount = ConvertAmount(
                auth,
                currencyYouSend,
                'CA',
                newAmountBig,
                false
            );

            const priceCA = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.PP_CA[0],
                    settings.tokens.CA[0].decimals
                )
            );

            const convertAmountUSD = convertAmount.times(priceCA);
            setSendingUSD(convertAmountUSD);

        }
    };

    const onChangeDestinationAddress = (event) => {
        if (event.target.value.length < 42 ) {
            setInputValidationAddressErrorText(t('send.infoAddressInvalid'));
            setInputValidationError(true);
        }
        setDestinationAddress(event.target.value);
    };

    const setAddTotalAvailable = () => {

        setIsDirtyYouSend(false);

        const tokenSettings = TokenSettings(currencyYouSend);
        const totalYouSend = new BigNumber(
            fromContractPrecisionDecimals(
                TokenBalance(auth, currencyYouSend),
                tokenSettings.decimals
            )
        );
        setAmountYouSend(totalYouSend);
        onChangeAmountYouSend(fromContractPrecisionDecimals(
            TokenBalance(auth, currencyYouSend),
            tokenSettings.decimals
        ), true);
    };

    return (
        <div>
            <div className="exchange-send-content">

                <div className="fields">

                    <div className="swap-from">
                        <SelectCurrency
                            className="select-token"
                            value={currencyYouSend}
                            currencyOptions={tokenExchange()}
                            onChange={onChangeCurrencyYouSend}
                        />

                        <InputAmount
                            InputValue={amountYouSend.toString() === '0' ? 0 : AmountToVisibleValue(
                                amountYouSend,
                                currencyYouSend,
                                3,
                                false
                            )}
                            placeholder={'0.0'}
                            onValueChange={onChangeAmountYouSend}
                            validateError={false}
                            isDirty={isDirtyYouSend}
                            balance={
                                PrecisionNumbers({
                                    amount: TokenBalance(auth, currencyYouSend),
                                    token: TokenSettings(currencyYouSend),
                                    decimals:
                                        TokenSettings(currencyYouSend)
                                            .visibleDecimals,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })
                            }
                            setAddTotalAvailable={setAddTotalAvailable}
                            action={t('send.labelSending')}
                            balanceText={t('send.labelBalance')}
                        />
                        <div className="input-validation-error">{inputValidationErrorText}</div>
                    </div>

                    <div className="swap-arrow">
                        <i className="icon-arrow-down"></i>
                    </div>

                    <div className="swap-to">

                        <div className="caption">{t('send.labelDestination')}</div>
                        <Input type="text" placeholder={t('send.placeholder')} className="input-address" onChange={onChangeDestinationAddress} />
                        <div className="input-validation-error">{inputValidationAddressErrorText}</div>

                    </div>
                </div>

            </div>

            <div className="exchange-send-footer">

                <div className="exchanging">

                    <span className={'token_exchange'}>{t('send.sendingSummary')} </span>
                    <span className={'symbol'}> {t('send.sendingSign')} </span>
                    {sendingUSD.toString() !== 'NaN' ? <span className={'token_receive'}>
                        {PrecisionNumbers({
                            amount: sendingUSD,
                            token: TokenSettings('CA_0'),
                            decimals: 2,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </span> : <span>0</span>}
                    <span className={'token_receive_name'}> {t('send.sendingCurrency')}</span>

                </div>

                <div className="actions-buttons">

                    <ModalConfirmSend
                        currencyYouExchange={currencyYouSend}
                        exchangingUSD={sendingUSD}
                        amountYouExchange={amountYouSend}
                        destinationAddress={destinationAddress}
                        onClear={onClear}
                        inputValidationError={inputValidationError}
                    />

                </div>

            </div>
        </div>
    );
}
