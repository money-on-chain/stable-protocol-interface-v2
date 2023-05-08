import BigNumber from 'bignumber.js';
import React, { useContext, useState, useEffect } from 'react';
import { Button, Collapse, Slider } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
//import IconStatusPending from "../../assets/icons/status-pending.png";
//import IconStatusSuccess from "../../assets/icons/status-success.png";
//import IconStatusError from "../../assets/icons/status-error.png";
import { PrecisionNumbers } from '../PrecisionNumbers';
import { ConvertAmount, TokenSettings } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import { isMintOperation, UserTokenAllowance } from '../../helpers/exchange';
import ModalAllowanceOperation from '../Modals/Allowance';
import CopyAddress from '../CopyAddress';

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
        onCloseModal
    } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const [status, setStatus] = useState('SUBMIT');
    const [tolerance, setTolerance] = useState(0.2);
    const [txID, setTxID] = useState('');

    const IS_MINT = isMintOperation(currencyYouExchange, currencyYouReceive);

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
            console.log('ERROR');
            setStatus('ERROR');
        });
    };

    const onTransaction = (transactionHash) => {
        // Tx receipt detected change status to waiting
        setStatus('WAITING');
        console.log('On transaction: ', transactionHash);
        setTxID(transactionHash);
    };

    const onReceipt = async (receipt) => {
        // Tx is mined ok
        console.log('On receipt: ', receipt);
        const filteredEvents = auth.interfaceDecodeEvents(receipt);
        setStatus('SUCCESS');

        // Refresh user balance
        auth.loadContractsStatusAndUserBalance().then((value) => {
            console.log('Refresh user balance OK!');
        });
    };

    let sentIcon = '';
    let statusLabel = '';
    switch (status) {
        case 'SUBMIT':
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = 'Wait for transaction confirmation';
            break;
        case 'SIGN':
            sentIcon = 'icon-signifier';
            statusLabel = 'Sign the transaction using your wallet';
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
        const limits = toleranceLimits(newTolerance);
        setAmountYouExchangeLimit(limits.exchange);
        setAmountYouReceiveLimit(limits.receive);
    };

    const onClose = () => {
        setStatus('SUBMIT');
        onCloseModal();
    };

    return (
        <div className="confirm-operation">
            <div className="exchange">
                <div className="swapFrom">
                    <span className="value">
                        {PrecisionNumbers({
                            amount: new BigNumber(amountYouExchangeLimit),
                            token: TokenSettings(currencyYouExchange),
                            decimals: 2,
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
                <div className="limitSection">
                    {IS_MINT && (
                        <span className="limitWarning">
                                Starting from
                                <span>
                                    {' '}
                                    {PrecisionNumbers({
                                        amount: new BigNumber(
                                            amountYouExchange
                                        ),
                                        token: TokenSettings(
                                            currencyYouExchange
                                        ),
                                        decimals: 2,
                                        t: t,
                                        i18n: i18n,
                                        ns: ns,
                                        skipContractConvert: true
                                    })}{' '}
                                </span>
                                (see price variation tolerance)
                            </span>
                    )}
                </div>

                <div className="swapArrow">
                    <i className="icon-arrow-down"></i>
                </div>

                <div className="swapTo">
                    <span className="value">
                        {PrecisionNumbers({
                            amount: new BigNumber(amountYouReceive),
                            token: TokenSettings(currencyYouReceive),
                            decimals: 2,
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
                                Minimum to receive
                                <span>
                                    {' '}
                                    {PrecisionNumbers({
                                        amount: new BigNumber(
                                            amountYouReceiveLimit
                                        ),
                                        token: TokenSettings(
                                            currencyYouReceive
                                        ),
                                        decimals: 2,
                                        t: t,
                                        i18n: i18n,
                                        ns: ns,
                                        skipContractConvert: true
                                    })}{' '}
                                </span>
                                (see price variation tolerance)
                            </span>
                    )}

                </div>

            </div>

            {/*<div className="prices">*/}
            {/*    <div className="rate_1">*/}
            {/*        <span className={'token_exchange'}>*/}
            {/*            {' '}*/}
            {/*            1{' '}*/}
            {/*            {t(`exchange.tokens.${currencyYouExchange}.abbr`, {*/}
            {/*                ns: ns*/}
            {/*            })}*/}
            {/*        </span>*/}
            {/*        <span className={'symbol'}> ≈ </span>*/}
            {/*        <span className={'token_receive'}>*/}
            {/*            {' '}*/}
            {/*            {PrecisionNumbers({*/}
            {/*                amount: ConvertAmount(*/}
            {/*                    auth,*/}
            {/*                    currencyYouExchange,*/}
            {/*                    currencyYouReceive,*/}
            {/*                    1,*/}
            {/*                    false*/}
            {/*                ),*/}
            {/*                token: TokenSettings(currencyYouExchange),*/}
            {/*                decimals: 6,*/}
            {/*                t: t,*/}
            {/*                i18n: i18n,*/}
            {/*                ns: ns,*/}
            {/*                skipContractConvert: true*/}
            {/*            })}*/}
            {/*        </span>*/}
            {/*        <span className={'token_receive_name'}>*/}
            {/*            {' '}*/}
            {/*            {t(`exchange.tokens.${currencyYouReceive}.abbr`, {*/}
            {/*                ns: ns*/}
            {/*            })}{' '}*/}
            {/*        </span>*/}
            {/*    </div>*/}
            {/*    <div className="rate_2">*/}
            {/*        <span className={'token_exchange'}>*/}
            {/*            {' '}*/}
            {/*            1{' '}*/}
            {/*            {t(`exchange.tokens.${currencyYouReceive}.abbr`, {*/}
            {/*                ns: ns*/}
            {/*            })}*/}
            {/*        </span>*/}
            {/*        <span className={'symbol'}> ≈ </span>*/}
            {/*        <span className={'token_receive'}>*/}
            {/*            {' '}*/}
            {/*            {PrecisionNumbers({*/}
            {/*                amount: ConvertAmount(*/}
            {/*                    auth,*/}
            {/*                    currencyYouReceive,*/}
            {/*                    currencyYouExchange,*/}
            {/*                    1,*/}
            {/*                    false*/}
            {/*                ),*/}
            {/*                token: TokenSettings(currencyYouReceive),*/}
            {/*                decimals: 6,*/}
            {/*                t: t,*/}
            {/*                i18n: i18n,*/}
            {/*                ns: ns,*/}
            {/*                skipContractConvert: true*/}
            {/*            })}*/}
            {/*        </span>*/}
            {/*        <span className={'token_receive_name'}>*/}
            {/*            {' '}*/}
            {/*            {t(`exchange.tokens.${currencyYouExchange}.abbr`, {*/}
            {/*                ns: ns*/}
            {/*            })}{' '}*/}
            {/*        </span>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="separator"></div>

            <div className="fees">
                <div className="value">
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
                            ? t(`exchange.tokens.${currencyYouExchange}.abbr`, {
                                  ns: ns
                              })
                            : t(`exchange.tokens.${currencyYouReceive}.abbr`, {
                                  ns: ns
                              })}{' '}
                    </span>
                </div>
                <div className="disclaimer">
                    This fee will be deducted from the transaction value
                    transferred.
                    <br />
                    Amounts my be different at transaction confirmation.
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
                                            Customize price variation tolerance
                                        </span>
                                    </div>
                                </div>
                                }
                                key="1"
                            >
                                <div className="PriceVariationContainer">
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
                                    <div className="warningSlider">
                                        After the transaction, the unused amount
                                        will be returned.
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                    </div>

                    <div className="exchanging">

                        <span className={'token_exchange'}>
                            Exchanging{' '}
                        </span>
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
                        <Button type="secondary" className="secondary-button-fixed btn-clear" onClick={onClose}>
                            Cancel
                        </Button>
                        <button
                            type="primary"
                            className="primary-button-fixed btn-confirm"
                            onClick={onSendTransaction}
                        >
                            Confirm
                        </button>
                    </div>

                </div>
            )}

            {(status === 'SIGN' ||
                status === 'WAITING' ||
                status === 'SUCCESS' ||
                status === 'ERROR') && (
                <div className="tx-sent">
                    <div className="status">
                        {(status === 'WAITING' ||
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
                            className="secondary-button-fixed btn-clear"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <ModalAllowanceOperation
                visible={showModalAllowance}
                onHideModalAllowance={onHideModalAllowance}
                currencyYouExchange={currencyYouExchange}
                currencyYouReceive={currencyYouReceive}
                amountYouExchangeLimit={amountYouExchangeLimit}
                amountYouReceiveLimit={amountYouReceiveLimit}
                onRealSendTransaction={onRealSendTransaction}
            />
        </div>
    );
}
