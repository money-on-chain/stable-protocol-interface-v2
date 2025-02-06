import BigNumber from 'bignumber.js';
import React, { useContext, useState, useEffect } from 'react';
import { Checkbox } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';

export default function AllowanceDialog(props) {
    const {
        onCloseModal,
        currencyYouExchange,
        currencyYouReceive,
        amountYouExchangeLimit,
        amountYouReceiveLimit,
        onRealSendTransaction,
        disAllowance
    } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const [status, setStatus] = useState('SUBMIT');
    let infinityAllowance = false;

    let sentIcon = '';
    let statusLabel = '';
    switch (status) {
        case 'SUBMIT':
            sentIcon = 'icon-tx-waiting';
            statusLabel = t('allowance.feedback.submit');
            break;
        case 'SIGN':
            sentIcon = 'icon-tx-signWallet';
            statusLabel = t('allowance.feedback.sign');
            break;
        case 'WAITING':
            sentIcon = 'icon-tx-waiting';
            statusLabel = t('allowance.feedback.waiting');
            break;
        case 'ERROR':
            sentIcon = 'icon-tx-error';
            statusLabel = t('allowance.feedback.error');
            break;
        default:
            sentIcon = 'icon-tx-waiting';
            statusLabel = t('allowance.feedback.default');
    }

    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
        infinityAllowance = e.target.checked;
    };

    const reset = () => {
        setStatus('SUBMIT');
        infinityAllowance = false;
    };

    const onClose = () => {
        reset();
        onCloseModal();
    };

    const onAuthorize = () => {
        // First change status to sign tx
        //amountAllowance = new BigNumber(1000) //Number.MAX_SAFE_INTEGER.toString()
        let amountAllowance;
        if (infinityAllowance) {
            amountAllowance = new BigNumber(100000000000);
        } else {
            amountAllowance = amountYouExchangeLimit;
        }

        if (disAllowance) {
            // Disallow to use the Token with amount 0
            amountAllowance = new BigNumber(0);
        }

        setStatus('SIGN');
        auth.interfaceAllowanceAmount(
            currencyYouExchange,
            currencyYouReceive,
            amountAllowance,
            onTransaction,
            onReceipt
        )
            .then((value) => {
                onClose();
            })
            .catch((error) => {
                console.log('ERROR');
                setStatus('ERROR');
            });
    };

    const onTransaction = (transactionHash) => {
        // Tx receipt detected change status to waiting
        setStatus('WAITING');
        console.log('On transaction: ', transactionHash);
    };

    const onReceipt = async (receipt) => {
        // Tx is mined ok proceed with operation transaction
        console.log('On receipt: ', receipt);
        /*
        // Events name list
        const filter = [
            'OperationError',
            'UnhandledError',
            'OperationQueued',
            'OperationExecuted'
        ];

        const contractName = 'MocQueue';

        const txRcp = await auth.web3.eth.getTransactionReceipt(
            receipt.transactionHash
        );
        const filteredEvents = decodeEvents(txRcp, contractName, filter);
         */
        onRealSendTransaction();
    };

    return (
        <div className="AllowanceDialog">
            <div className="tx-amount-group">
                {status === 'SUBMIT' && (
                    <div className="tx-feedback-container">
                        {disAllowance ? (
                            <div className="tx-feedback-text">
                                {t('allowance.statusDisallowanceText')}
                            </div>
                        ) : (
                            <div className="tx-feedback-text">
                                {t('allowance.statusText1')}
                                <br />
                                {t('allowance.statusText2')}
                            </div>
                        )}
                        <div className="option-checkbox">
                            {!disAllowance && (
                                <Checkbox
                                    className="check-unlimited"
                                    onChange={onChange}
                                >
                                    {t('allowance.setUnlimited')}
                                </Checkbox>
                            )}
                        </div>
                        <div className="cta-container">
                            <div className="cta-options-group">
                                <button
                                    type="secondary"
                                    className="button secondary"
                                    onClick={onClose}
                                >
                                    {t('allowance.confirm.cancel')}
                                </button>
                                <button
                                    type="primary"
                                    className="button"
                                    onClick={onAuthorize}
                                >
                                    {t('allowance.confirm.authorize')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {(status === 'SIGN' ||
                    status === 'WAITING' ||
                    status === 'ERROR') && (
                    <div className="tx-amount-group">
                        <div className="tx-feedback-container">
                            <div className="tx-feedback-text">
                                {statusLabel}
                            </div>
                            <div className="tx-feedback-icon tx-logo-status">
                                <div className={sentIcon}></div>
                            </div>
                        </div>
                        <div className="cta-container">
                            <div className="cta-options-group">
                                <button
                                    type="primary"
                                    className="button secondary"
                                    onClick={onClose}
                                >
                                    {t('allowance.confirm.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>{' '}
        </div>
    );
}
