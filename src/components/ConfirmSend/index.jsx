import BigNumber from 'bignumber.js';
import React, { useContext, useState } from 'react';
import { Button } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import CopyAddress from '../CopyAddress';

export default function ConfirmSend(props) {
    const { currencyYouExchange, exchangingUSD, amountYouExchange, destinationAddress, onCloseModal } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const [status, setStatus] = useState('SUBMIT');
    const [txID, setTxID] = useState('');

    const onSendTransaction = () => {
        // Real send transaction
        setStatus('SIGN');

        auth.interfaceTransferToken(currencyYouExchange, amountYouExchange, destinationAddress.toLowerCase(), onTransaction, onReceipt)
            .then((value) => {
                console.log('DONE!');
            })
            .catch((error) => {
                console.log('ERROR');
                setStatus('ERROR');
                console.log(error);
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
            sentIcon = 'icon-tx-waiting ';
            statusLabel = t('send.feedback.submit');
            break;
        case 'SIGN':
            sentIcon = 'icon-signifier';
            statusLabel = t('send.feedback.sign');
            break;
        case 'WAITING':
            sentIcon = 'icon-tx-waiting ';
            statusLabel = t('send.feedback.waiting');
            break;
        case 'SUCCESS':
            sentIcon = 'icon-tx-success';
            statusLabel = t('send.feedback.success');
            break;
        case 'ERROR':
            sentIcon = 'icon-tx-error';
            statusLabel = t('send.feedback.error');
            break;
        default:
            sentIcon = 'icon-tx-waiting ';
            statusLabel = t('send.feedback.default');
    }

    const onClose = () => {
        setStatus('SUBMIT');
        onCloseModal();
    };

    return (
        <div className="confirm-operation">
            {/* <div className="exchange"> */}
            <div className="tx-amount-group">
                <div className="tx-amount-container">
                    <div className="tx-amount-data">
                        <div className="tx-amount">
                            {PrecisionNumbers({
                                amount: new BigNumber(amountYouExchange),
                                token: TokenSettings(currencyYouExchange),
                                decimals: 8,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })}
                        </div>
                        <div className="tx-token">
                            {' '}
                            {t(`exchange.tokens.${currencyYouExchange}.label`, {
                                ns: ns
                            })}{' '}
                        </div>
                    </div>
                    <div className="tx-direction">
                        <div className="tx-direction swapArrow">
                            <div className="icon-arrow-down"></div>
                        </div>
                    </div>{' '}
                    {/* <div className="swapTo"> */}
                    <div className="tx-destination-address">{destinationAddress}</div>
                    {/* </div> */}
                </div>{' '}
            </div>
            {status === 'SUBMIT' && (
                <div className="cta-container">
                    <div className="cta-info-group">
                        <div className="cta-info-summary">
                            <div className={'token_exchange'}>{t('send.sendingSummary')} </div>
                            <div className={'symbol'}> {t('send.sendingSign')} </div>
                            <div className={'token_receive'}>
                                {PrecisionNumbers({
                                    amount: exchangingUSD,
                                    token: TokenSettings('CA_0'),
                                    decimals: 8,
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: true
                                })}
                            </div>

                            <div className={'token_receive_name'}> {t('send.sendingCurrency')}</div>
                        </div>
                    </div>
                    <div className="cta-options-group">
                        <Button
                            type="secondary"
                            className={
                                process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()
                                    ? 'secondary-button btn-clear'
                                    : 'secondary-button btn-clear'
                            }
                            onClick={onClose}
                        >
                            {t('send.buttonCancel')}
                        </Button>
                        <button
                            type="primary"
                            className={
                                process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()
                                    ? `primary-button btn-confirm`
                                    : `primary-button btn-confirm`
                            }
                            onClick={onSendTransaction}
                        >
                            {t('send.buttonConfirm')}
                        </button>
                    </div>
                </div>
            )}
            {/* </div> */}
            {(status === 'SIGN' || status === 'WAITING' || status === 'SUCCESS' || status === 'ERROR') && (
                <div className="conditional-wrapper">
                    {(status === 'WAITING' || status === 'SUCCESS' || status === 'ERROR') && (
                        <div className="tx-id-container">
                            <div className="tx-id-data status">
                                {' '}
                                <div className="tx-id-data">
                                    <div className="tx-id-label">{t('send.labelTransactionID')}</div>
                                    <div className="tx-id-address">
                                        <CopyAddress address={txID} type={'tx'}></CopyAddress>
                                        {/*<span className="address">*/}
                                        {/*    {truncateTxId(txID)}*/}
                                        {/*</span>*/}
                                        {/*<i className="icon-copy"></i>*/}
                                    </div>{' '}
                                </div>
                            </div>{' '}
                        </div>
                    )}{' '}
                    <div className="tx-feedback-container">
                        <div className="tx-feedback-icon tx-logo-status">
                            <div className={sentIcon}></div>
                        </div>
                        <div className="tx-feedback-text">{statusLabel}</div>
                    </div>
                    <div className="cta-container">
                        <div className="cta-options-group">
                            <button
                                type="primary"
                                className={
                                    process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() === 'roc'
                                        ? 'secondary-button btn-clear'
                                        : 'secondary-button btn-clear'
                                }
                                onClick={onClose}
                            >
                                {t('send.buttonClose')}
                            </button>
                        </div>
                    </div>
                </div>
            )}{' '}
        </div>
    );
}
