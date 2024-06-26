import BigNumber from 'bignumber.js';
import React, { useContext, useState } from 'react';
import { Button } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import CopyAddress from '../CopyAddress';


export default function ConfirmSend(props) {
    const {
        currencyYouExchange,
        exchangingUSD,
        amountYouExchange,
        destinationAddress,
        onCloseModal
    } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const [status, setStatus] = useState('SUBMIT');
    const [txID, setTxID] = useState('');

    const onSendTransaction = () => {
        // Real send transaction
        setStatus('SIGN');

        auth.interfaceTransferToken(
            currencyYouExchange,
            amountYouExchange,
            destinationAddress.toLowerCase(),
            onTransaction,
            onReceipt
        ).then((value) => {
            console.log('DONE!');
        }).catch((error) => {
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
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = t('send.feedback.submit');
            break;
        case 'SIGN':
            sentIcon = 'icon-signifier';
            statusLabel =  t('send.feedback.sign');
            break;
        case 'WAITING':
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel =  t('send.feedback.waiting');
            break;
        case 'SUCCESS':
            sentIcon = 'icon-tx-success';
            statusLabel =  t('send.feedback.success');
            break;
        case 'ERROR':
            sentIcon = 'icon-tx-error';
            statusLabel =  t('send.feedback.error');
            break;
        default:
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel =  t('send.feedback.default');
    }

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
                            amount: new BigNumber(amountYouExchange),
                            token: TokenSettings(currencyYouExchange),
                            decimals: 8,
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
                    <div className="address">
                        {destinationAddress}
                    </div>
                </div>

            </div>


            {status === 'SUBMIT' && (
                <div className="tx-submit">

                    <div className="exchanging">

                        <span className={'token_exchange'}>
                        {t('send.sendingSummary')}{' '}
                        </span>
                        <span className={'symbol'}> {t('send.sendingSign')} </span>
                        <span className={'token_receive'}>
                            {PrecisionNumbers({
                                amount: exchangingUSD,
                                token: TokenSettings('CA_0'),
                                decimals: 8,
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })}
                        </span>
                        <span className={'token_receive_name'}> {t('send.sendingCurrency')}</span>

                    </div>

                    <div className="actions-buttons">
                        <Button type="secondary" className={process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() ? "secondary-button btn-clear" : "secondary-button btn-clear"} onClick={onClose}>
                            {t('send.buttonCancel')}
                        </Button>
                        <button
                            type="primary"
                            className={process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() ? `primary-button btn-confirm` : `primary-button btn-confirm`}
                            onClick={onSendTransaction}
                        >
                            {t('send.buttonConfirm')}
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
                                <div className="label">{t('send.labelTransactionID')}</div>
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
                            className={process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase() === 'roc' ? "secondary-button btn-clear" : "secondary-button btn-clear"}
                            onClick={onClose}
                        >
                            {t('send.buttonClose')}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
