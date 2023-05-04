import BigNumber from 'bignumber.js';
import React, { useContext, useState } from 'react';
import { Button } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { TokenSettings } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';


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

    const truncateTxId = (TxId) => {
        if (TxId === '') return '';
        return TxId.substring(0, 6) + '...' + TxId.substring(TxId.length - 4, TxId.length);
    };

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

                <div className="swapArrow">
                    <i className="icon-arrow-down"></i>
                </div>

                <div className="swapTo">
                    <div className="address">
                        {destinationAddress}
                    </div>
                </div>

            </div>

            <div className="separator"></div>

            {status === 'SUBMIT' && (
                <div className="tx-submit">

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
                                    <span className="address">
                                        {truncateTxId(txID)}
                                    </span>
                                    <i className="icon-copy"></i>
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

        </div>
    );
}
