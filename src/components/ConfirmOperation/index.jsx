import BigNumber from 'bignumber.js';
import React, { useContext, useState, useEffect } from 'react';
import { Button, Collapse, Slider } from 'antd';
import axios from 'axios';

import { useProjectTranslation } from '../../helpers/translations';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { ConvertAmount, TokenSettings, TokenBalance } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import { isMintOperation, UserTokenAllowance } from '../../helpers/exchange';
import ModalAllowanceOperation from '../Modals/Allowance';
import CopyAddress from '../CopyAddress';
import settings from '../../settings/settings.json';

const { Panel } = Collapse;

export default function ConfirmOperation(props) {
    const {
        currencyYouExchange,
        currencyYouReceive,
        exchangingUSD,
        commission,
        commissionPercent,
        amountYouExchange,
        amountYouReceive,
        onCloseModal,
        executionFee,
        commissionFeeToken,
        commissionPercentFeeToken,
        radioSelectFee
    } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const [status, setStatus] = useState('SUBMIT');
    const [tolerance, setTolerance] = useState(0.7);
    const [txID, setTxID] = useState('');
    const [opID, setOpID] = useState(null);
    const [toleranceError, setToleranceError] = useState('');
    const IS_MINT = isMintOperation(currencyYouExchange, currencyYouReceive);

    useEffect(() => {
        let timerId;
        if (status === 'QUEUING') {
            console.log('Operation queuing... waiting for operation execution.');
            timerId = setTimeout(() => {
                if (status === 'QUEUING') {
                    setStatus('ERROR');
                    console.log('Operation failed after waiting 20 minutes for execution after queuing.');
                }
            }, 600000);
        }
        if (status === 'QUEUED') {
            console.log('Operation queued... waiting for operation execution.');
            timerId = setTimeout(() => {
                if (status === 'QUEUED') {
                    setStatus('ERROR');
                    console.log('Operation failed after waiting 10 minutes for execution.');
                }
            }, 600000);
        }
    
        return () => clearTimeout(timerId);
    }, [status]);

    const toleranceLimits = (newTolerance) => {
        let limitExchange;
        let limitReceive;
        if (IS_MINT) {
            limitExchange = new BigNumber(amountYouExchange)
                .times(new BigNumber(newTolerance))
                .div(100)
                .plus(new BigNumber(amountYouExchange));
            limitReceive = amountYouReceive;
        } else {
            limitExchange = amountYouExchange;
            limitReceive = new BigNumber(amountYouReceive)
                .times(new BigNumber(newTolerance))
                .div(100)
                .minus(new BigNumber(amountYouReceive))
                .abs();
        }

        const limits = {
            exchange: limitExchange,
            receive: limitReceive
        };

        return limits;
    };

    const limits = toleranceLimits(tolerance);

    const [amountYouExchangeLimit, setAmountYouExchangeLimit] = useState(
        limits.exchange
    );
    const [amountYouReceiveLimit, setAmountYouReceiveLimit] = useState(
        limits.receive
    );
    const [showModalAllowance, setShowModalAllowance] = useState(false);
    const [showModalAllowanceFeeToken, setShowModalAllowanceFeeToken] = useState(false);
    const [disAllowanceFeeToken, setDisAllowanceFeeToken] = useState(false);

    useEffect(() => {
        if (amountYouExchange) {
            const limits = toleranceLimits(tolerance);
            setAmountYouExchangeLimit(limits.exchange);
        }
    }, [amountYouExchange]);

    useEffect(() => {
        if (amountYouReceive) {
            const limits = toleranceLimits(tolerance);
            setAmountYouReceiveLimit(limits.receive);
        }
    }, [amountYouReceive]);

    useEffect(() => {
        const interval = setInterval(() => {
            opStatus();
        }, 5000);
        return () => clearInterval(interval);
    }, [opID]);

    const onHideModalAllowance = () => {
        setShowModalAllowance(false);
    };

    const onShowModalAllowance = () => {
        setShowModalAllowance(true);
    };

    const showAllowance = () => {
        const tokenAllowance = UserTokenAllowance(auth, currencyYouExchange);
        return !!amountYouExchangeLimit.gte(tokenAllowance);
    };

    const onHideModalAllowanceFeeToken = () => {
        setShowModalAllowanceFeeToken(false);
    };

    const onShowModalAllowanceFeeToken = () => {
        setShowModalAllowanceFeeToken(true);
    };

    const showAllowanceFeeToken = () => {

        const tokenAllowance = UserTokenAllowance(auth, 'TF');

        if (radioSelectFee === 0 && tokenAllowance.gte(commissionFeeToken)) {
            // if we select not to pay with fee token, please disallow to use Fee token
            setDisAllowanceFeeToken(true)
            // show allowance window
            return true
        } else if (radioSelectFee > 0) {
            return !!commissionFeeToken.gte(tokenAllowance);
        }

        return false
    };

    const onSendTransactionAllowFeeToken = () => {
        // Show modal allowance
        if (showAllowanceFeeToken()) {
            onShowModalAllowanceFeeToken();
            return;
        }

        // If allowance is ok please send real operation transaction
        onSendTransaction();
    };

    const onSendTransaction = () => {
        // Show modal allowance
        if (showAllowance()) {
            onShowModalAllowance();
            return;
        }

        // If allowance is ok please send real operation transaction
        onRealSendTransaction();
    };

    const onRealSendTransaction = () => {
        // Real send transaction
        setStatus('SIGN');

        let tokenAmount;
        let limitAmount;
        if (IS_MINT) {
            tokenAmount = amountYouReceive;
            limitAmount = amountYouExchangeLimit;
        } else {
            tokenAmount = amountYouExchange;
            limitAmount = amountYouReceiveLimit;
        }

        auth.interfaceExchangeMethod(
            currencyYouExchange,
            currencyYouReceive,
            tokenAmount,
            limitAmount,
            onTransaction,
            onReceipt
        ).then((value) => {
            console.log('DONE!');
        }).catch((error) => {
            console.log(error)
            setStatus('ERROR');
        });
    };

    const onTransaction = (transactionHash) => {
        // Tx receipt detected change status to waiting
        setStatus('QUEUING');
        console.log('On transaction: ', transactionHash);
        setTxID(transactionHash);
    };

    const opStatus = () => {

        if (!opID) {
            console.log("Operation Status: Checking... NO.")
            return
        }

        const apiUrl = `${process.env.REACT_APP_ENVIRONMENT_API_OPERATIONS}` +
            'operations/oper_id/'
        axios.get(apiUrl, {
            params: {
                oper_id: opID
            },
            timeout: 10000
        }).then((response) => {
            if (response.status === 200) {
                if (response.data.status === 0) {
                    // Pending executed
                    console.log("Operation Status: OK Pending execute.")

                } else if (response.data.status === 1) {
                    // executed operation is finished

                    setStatus('SUCCESS');

                    // Remove Op ID
                    setOpID(null)

                    // Refresh user balance
                    auth.loadContractsStatusAndUserBalance().then((value) => {
                        console.log('Refresh user balance OK!');
                    });

                    console.log("Operation Status: OK Executed.")

                } else if (response.data.status === 1) {

                    setStatus('ERROR');

                    // Remove Op ID
                    setOpID(null);

                    console.log("Operation Status: Error! Status: ", response.data.status)

                }
            }


        }).catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                if (error.response.status===404) {
                    // No problem if is 404 error mean is not indexed
                }
            }
            //setStatus('ERROR');
        });

    }

    const onQueued = (filteredEvents) => {

        let operId = 0
        filteredEvents.then((results) => {
            results.forEach(function (events) {
                if (events.name === 'OperationQueued') {
                    // Is the event operation queue
                    events.events.forEach(function (field) {
                        if (field.name === 'operId_') {
                            operId = parseInt(field.value);
                        }
                    })
                }
            })

            if (operId > 0) {
                console.log("Setting operation ID:", operId)
                setOpID(operId)
                //setOpID(33)
                setStatus('QUEUED');
            }

        }).catch((error) => {
            console.log(error)
        });

    }

    const onReceipt = async (receipt) => {
        // Tx is mined ok
        console.log('On receipt: ', receipt);
        const filteredEvents = auth.interfaceDecodeEvents(receipt);
        //setStatus('SUCCESS');

        // on Queue
        onQueued(filteredEvents)
    };

    let sentIcon = '';
    let statusLabel = '';
    switch (status) {
        case 'SUBMIT':
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = t('exchange.confirm.submit');
            break;
        case 'SIGN':
            sentIcon = 'icon-signifier';
            statusLabel = t('exchange.confirm.sign');
            break;
        case 'QUEUING':
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = t('exchange.confirm.queuing');
            break;
        case 'QUEUED':
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = t('exchange.confirm.queued');
            break;
        case 'CONFIRMING':
            sentIcon = 'icon-operation-tx-confirming rotate';
            statusLabel = t('exchange.confirm.confirming');
            break;
        case 'SUCCESS':
            sentIcon = 'icon-tx-success';
            statusLabel = t('exchange.confirm.confirmed');
            break;
        case 'ERROR':
            sentIcon = 'icon-tx-error';
            statusLabel = t('exchange.confirm.error');
            break;
        default:
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = t('exchange.confirm.default');
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
        const limits = toleranceLimits(newTolerance);
        const totalBalance = new BigNumber(
            fromContractPrecisionDecimals(
                TokenBalance(auth, currencyYouExchange),
                TokenSettings(currencyYouExchange).decimals
            )
        );
        if (limits.exchange.gt(totalBalance)) {
            console.log('Insufficient balance');
            setToleranceError('Tolerance exceeds user balance');
            return;
        }
        setToleranceError('');
        setAmountYouExchangeLimit(limits.exchange);
        setAmountYouReceiveLimit(limits.receive);
    };

    const onClose = () => {
        setStatus('SUBMIT');
        onCloseModal();
    };

    // Commission Select Radio

    let commissionPAY = commission
    let commissionPercentPAY = commissionPercent
    let commissionSettings = TokenSettings(currencyYouExchange)
    let commissionTokenName

    if (IS_MINT) {
        commissionTokenName = t(`exchange.tokens.${currencyYouExchange}.abbr`, {
            ns: ns
        })
    } else {
        commissionTokenName = t(`exchange.tokens.${currencyYouReceive}.abbr`, {
            ns: ns
        })
    }

    if (radioSelectFee > 0) {
        // Pay with Fee Token
        commissionPAY = commissionFeeToken
        commissionPercentPAY = commissionPercentFeeToken
        commissionSettings = TokenSettings('TF')
        commissionTokenName = t(`exchange.tokens.TF.abbr`, {
            ns: ns
        })
    }

    return (
        <div className="confirm-operation">
            <div className="exchange">
                <div className="swapFrom">
                    <span className="value">
                        {PrecisionNumbers({
                            amount: new BigNumber(amountYouExchangeLimit),
                            token: TokenSettings(currencyYouExchange),
                            decimals: 4,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </span>
                    <span className="token">
                        {' '}
                        {t(`exchange.tokens.${currencyYouExchange}.label`, {
                            ns: ns
                        })}{' '}
                    </span>
                </div>
                

                <div className="swapArrow">
                    <i className="icon-arrow-down"></i>
                </div>

                <div className="swapTo">
                    <span className="value">
                        {PrecisionNumbers({
                            amount: new BigNumber(amountYouReceive),
                            token: TokenSettings(currencyYouReceive),
                            decimals: 4,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </span>
                    <span className="token">
                        {' '}
                        {t(`exchange.tokens.${currencyYouReceive}.label`, {
                            ns: ns
                        })}{' '}
                    </span>
                </div>
                <div className="limitSection">
                    {!IS_MINT && (
                        <span className="limitWarning">
                                   {t('exchange.confirm.minimumWarning')}
                                <span>
                                    {' '}
                                    {PrecisionNumbers({
                                        amount: new BigNumber(
                                            amountYouReceiveLimit
                                        ),
                                        token: TokenSettings(
                                            currencyYouReceive
                                        ),
                                        decimals: 4,
                                        t: t,
                                        i18n: i18n,
                                        ns: ns,
                                        skipContractConvert: true
                                    })}{' '}
                                </span>
                                {t('exchange.confirm.minimumExplanation')}
                            </span>
                    )}

                </div>

            </div>

            <div className="separator"></div>

            <div className="fees">
                <div className="value">
                    <span className={'token_exchange'}>
                        {t('fees.labelFee')} (
                        {PrecisionNumbers({
                            amount: new BigNumber(commissionPercentPAY),
                            token: commissionSettings,
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
                            amount: new BigNumber(commissionPAY),
                            token: commissionSettings,
                            decimals: 6,
                            t: t,
                            i18n: i18n,
                            ns: ns,
                            skipContractConvert: true
                        })}
                    </span>
                    <span className={'token_receive_name'}>
                        {commissionTokenName}
                    </span>
                </div>
                <div className="disclaimer">
                    {t('fees.disclaimer1')}
                    <br />
                    {t('fees.disclaimer2')}
                </div>
            </div>

            <div className="separator"></div>

            {status === 'SUBMIT' && (
                <div className="tx-submit">
                    <div className="customize-tolerance">
                        <Collapse accordion className="CollapseTolerance">
                            <Panel
                                showArrow={false}
                                header={
                                <div className="VariationHeader">
                                    <div className="PriceVariationSetting">
                                        <i className="icon-wheel"></i>
                                        <span className="SliderText">
                                        {t('exchange.priceVariation.title')}
                                        </span>
                                    </div>
                                </div>
                                }
                                key="1"
                            >
                                <div className="PriceVariationContainer">
                                    <div className="warningSlider">
                                    {t('exchange.priceVariation.sliderLabel')}
                                    </div>
                                    <Slider
                                        className="SliderControl"
                                        marks={priceVariationToleranceMarks}
                                        defaultValue={tolerance}
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        dots={false}
                                        onChange={(val) => changeTolerance(val)}
                                    />
                                    
                                </div>
                            </Panel>
                        </Collapse>
                    </div>

                    <div className="exchanging">

                        <span className={'token_exchange'}>
                        {t('exchange.exchangingSummary')}{' '}
                        </span>
                        <span className={'symbol'}> {t('exchange.exchangingSign')} </span>
                        <span className={'token_receive'}>
                            {PrecisionNumbers({
                                amount: exchangingUSD,
                                token: TokenSettings('CA_0'),
                                decimals: 4,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })}
                        </span>
                        <span className={'token_receive_name'}> {t('exchange.exchangingCurrency')}</span>

                    </div>
                    {toleranceError !== '' && <div className="error-container">
                        <span className='confirm-error'>
                            {toleranceError}
                        </span>
                    </div>}

                    <div className="actions-buttons">
                        <Button type="secondary" className="secondary-button btn-clear" onClick={onClose}>
                        {t('exchange.buttonCancel')}
                        </Button>
                        <button
                            type="primary"
                            className="primary-button btn-confirm"
                            onClick={onSendTransactionAllowFeeToken}
                            disabled={toleranceError !== ''}
                        >
                            {t('exchange.buttonConfirm')}
                        </button>
                    </div>

                </div>
            )}

            {(
                status === 'SIGN' ||
                status === 'QUEUING' ||
                status === 'QUEUED' ||
                status === 'CONFIRMING' ||
                status === 'SUCCESS' ||
                status === 'ERROR') && (
                <div className="tx-sent">
                    <div className="status">
                        {(status === 'QUEUING' ||
                            status === 'QUEUED' ||
                            status === 'CONFIRMING' ||
                            status === 'SUCCESS' ||
                            status === 'ERROR') && (
                            <div className="transaction-id">
                                <div className="label">Transaction ID</div>
                                <div className="address-section">
                                    <CopyAddress address={txID} type={'tx'}></CopyAddress>
                                    {/*<span className="address">*/}
                                    {/*    {truncateTxId(txID)}*/}
                                    {/*</span>*/}
                                    {/*<i className="icon-copy"></i>*/}
                                </div>
                            </div>
                        )}

                        <div className="tx-logo-status">
                            <i className={sentIcon}></i>
                        </div>

                        <div className="status-label">{statusLabel}</div>

                        <button
                            type="primary"
                            className="secondary-button btn-clear"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <ModalAllowanceOperation
                title={`${t('allowance.cardTitle')}  ${t(`exchange.tokens.${currencyYouExchange}.label`, {ns: ns})}`}
                visible={showModalAllowance}
                onHideModalAllowance={onHideModalAllowance}
                currencyYouExchange={currencyYouExchange}
                currencyYouReceive={currencyYouReceive}
                amountYouExchangeLimit={amountYouExchangeLimit}
                amountYouReceiveLimit={amountYouReceiveLimit}
                onRealSendTransaction={onRealSendTransaction}
                disAllowance={false}
            />

            <ModalAllowanceOperation
                title={`${t('allowance.cardTitle')}  ${t(`exchange.tokens.TF.abbr`, {ns: ns})}`}
                visible={showModalAllowanceFeeToken}
                onHideModalAllowance={onHideModalAllowanceFeeToken}
                currencyYouExchange={'TF'}
                currencyYouReceive={'TF'}
                amountYouExchangeLimit={commissionFeeToken}
                amountYouReceiveLimit={commissionFeeToken}
                onRealSendTransaction={onSendTransaction}
                disAllowance={disAllowanceFeeToken}
            />

        </div>
    );
}
