import { Button, Input } from 'antd';
import React, { useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

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

import { PrecisionNumbers } from '../PrecisionNumbers';
import { AuthenticateContext } from '../../context/Auth';
import InputAmount from '../InputAmount';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import ModalConfirmSend from '../Modals/ConfirmSend';

export default function Send() {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const defaultTokenExchange = tokenExchange()[0];

    const [currencyYouExchange, setCurrencyYouExchange] =
        useState(defaultTokenExchange);

    const [amountYouExchange, setAmountYouExchange] = useState(
        new BigNumber(0)
    );
    const [destinationAddress, setDestinationAddress] = useState('');

    const [exchangingUSD, setExchangingUSD] = useState(new BigNumber(0));

    const [isDirtyYouExchange, setIsDirtyYouExchange] = useState(false);

    const [inputValidationErrorText, setInputValidationErrorText] = useState('');
    const [inputValidationAddressErrorText, setInputValidationAddressErrorText] = useState('');
    const [inputValidationError, setInputValidationError] = useState(false);

    useEffect(() => {
        setAmountYouExchange(amountYouExchange);
    }, [amountYouExchange]);


    useEffect(() => {
        if (amountYouExchange) {
            onValidate();
        }
    }, [amountYouExchange]);

    useEffect(() => {
        if (destinationAddress) {
            onValidate();
        }
    }, [destinationAddress]);

    const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
        onClear();
        setCurrencyYouExchange(newCurrencyYouExchange);
    };

    const onClear = () => {
        setIsDirtyYouExchange(false);
        setAmountYouExchange(new BigNumber(0));
    };

    const onValidate = () => {
        console.log('onValidate');
        console.log(destinationAddress);
        let amountInputError = false
        let addressInputError = false

        // 1. User Exchange Token Validation
        const totalBalance = new BigNumber(
            fromContractPrecisionDecimals(
                TokenBalance(auth, currencyYouExchange),
                TokenSettings(currencyYouExchange).decimals
            )
        );

        if (amountYouExchange.gt(totalBalance)) {
            setInputValidationErrorText(t('send.infoNoBalance'));
            amountInputError = true
        }

        // 2. Input address valid
        if (destinationAddress === '') {
            setInputValidationAddressErrorText(t('send.infoAddressEmpty'));
            addressInputError = true
        } else if (destinationAddress.length < 42) {
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
        }  else {
            setInputValidationError(false);
        }

    };

    const onChangeAmountYouExchange = (newAmount) => {

        setIsDirtyYouExchange(true);
        setAmountYouExchange(new BigNumber(newAmount));

        const usdAmount = ConvertAmount(
            auth,
            currencyYouExchange,
            'CA_0',
            newAmount,
            false
        );
        setExchangingUSD(usdAmount);

    };

    const onChangeDestinationAddress = (event) => {
        setDestinationAddress(event.target.value);
    };

    const setAddTotalAvailable = () => {

        setIsDirtyYouExchange(false);

        const tokenSettings = TokenSettings(currencyYouExchange);
        const totalYouExchange = new BigNumber(
            fromContractPrecisionDecimals(
                TokenBalance(auth, currencyYouExchange),
                tokenSettings.decimals
            )
        );
        setAmountYouExchange(totalYouExchange);
    };

    return (
        <div>
            <div className="exchange-send-content">

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
                                currencyYouExchange,
                                3,
                                false
                            )}
                            placeholder={'0.0'}
                            onValueChange={onChangeAmountYouExchange}
                            validateError={false}
                            isDirty={isDirtyYouExchange}
                            balance={
                                PrecisionNumbers({
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
                            action={'SENDING'}
                        />
                        <div className="input-validation-error">{inputValidationErrorText}</div>
                    </div>

                    <div className="swap-arrow">
                        <i className="icon-arrow-down"></i>
                    </div>

                    <div className="swap-to">

                        <div className="caption">{t('send.labelSending')} </div>
                        <Input type="text" placeholder="Destination address" className="input-address" onChange={onChangeDestinationAddress} />
                        <div className="input-validation-error">{inputValidationAddressErrorText}</div>

                    </div>
                </div>

            </div>

            <div className="exchange-send-footer">

                <div className="exchanging">

                    <span className={'token_exchange'}>{t('send.sendingSummary')} </span>
                    <span className={'symbol'}> {t('send.sendingSign')} </span>
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
                    <span className={'token_receive_name'}> {t('send.sendingCurrency')}</span>

                </div>

                <div className="actions-buttons">

                    <ModalConfirmSend
                        currencyYouExchange={currencyYouExchange}
                        exchangingUSD={exchangingUSD}
                        amountYouExchange={amountYouExchange}
                        destinationAddress={destinationAddress}
                        onClear={onClear}
                        inputValidationError={inputValidationError}
                    />

                </div>

            </div>
        </div>
    );
}
