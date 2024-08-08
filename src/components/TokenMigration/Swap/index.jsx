import React, { useContext, useState, useEffect } from 'react';
import { useProjectTranslation } from '../../../helpers/translations';
import { Button } from 'antd';
import './style.scss';
import { AuthenticateContext } from '../../../context/Auth';

import TokenMigratePNG from './../../../assets/icons/tokenmigrate.png';
import Copy from '../../Page/Copy';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import { TokenSettings } from '../../../helpers/currencies';

const SwapToken = (props) => {
    const { onCloseModal } = props;

    const [status, setStatus] = useState('SUBMIT');
    const [txID, setTxID] = useState(
        '0x0000000000000000000000000000000000000000'
    );

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const onClose = () => {
        setStatus('SUBMIT');
        onCloseModal();
    };

    const onSubmit = () => {
        setStatus('CONFIRM');
    };

    const onSuccess = () => {
        setStatus('TOKEN-MIGRATION-SUCCESS');
    };

    const TruncateAddress = (address) => {
        return (
            address.substring(0, 6) +
            '...' +
            address.substring(address.length - 4, address.length)
        );
    };

    const onTokenMigration = () => {
        // First change status to sign tx
        setStatus('TOKEN-MIGRATION-SIGN');
        auth.interfaceMigrateToken(
            onTransactionTokenMigration,
            onReceiptTokenMigration,
            onErrorTokenMigration
        )
            .then((value) => {
                onSuccess();
            })
            .catch((response) => {
                onClose();
            });
    };

    const onTransactionTokenMigration = (transactionHash) => {
        // Tx receipt detected change status to waiting
        setStatus('TOKEN-MIGRATION-WAITING');
        console.log('On transaction token migration: ', transactionHash);
        setTxID(transactionHash);
    };

    const onReceiptTokenMigration = async (receipt) => {
        // Tx is mined ok proceed with operation transaction
        console.log('On receipt token migration: ', receipt);
        const filteredEvents = auth.interfaceDecodeEvents(receipt);
    };

    const onErrorTokenMigration = async (error) => {
        // Tx error
        setStatus('TOKEN-MIGRATION-ERROR');
        console.log('Transaction error: ', error);
    };

    const onAuthorize = () => {
        // First change status to sign tx

        setStatus('ALLOWANCE-SIGN');

        const allowanceAmount = new BigNumber(
            Web3.utils.fromWei(auth.userBalanceData.tpLegacy.balance, 'ether')
        );
        const oldAllowanceAmount = new BigNumber(
            Web3.utils.fromWei(auth.userBalanceData.tpLegacy.allowance, 'ether')
        );

        if (oldAllowanceAmount.gte(allowanceAmount)) {
            onTokenMigration();
        } else {
            auth.interfaceAllowUseTokenMigrator(
                allowanceAmount,
                onTransactionAuthorize,
                onReceiptAuthorize,
                onErrorAuthorize
            )
                .then((value) => {
                    onTokenMigration();
                })
                .catch((response) => {
                    onClose();
                });
        }
    };

    const onTransactionAuthorize = (transactionHash) => {
        // Tx receipt detected change status to waiting
        setStatus('ALLOWANCE-WAITING');
        console.log('On transaction authorize: ', transactionHash);
        setTxID(transactionHash);
    };

    const onReceiptAuthorize = async (receipt) => {
        // Tx is mined ok proceed with operation transaction
        console.log('On receipt authorize: ', receipt);
        const filteredEvents = auth.interfaceDecodeEvents(receipt);
    };

    const onErrorAuthorize = async (error) => {
        // Tx Authorize error
        setStatus('TOKEN-MIGRATION-ERROR');
        console.log('Transaction error: ', error);
    };

    const onConfirm = () => {
        switch (status) {
            case 'SUBMIT':
                onSubmit();
                break;
            case 'CONFIRM':
                onAuthorize();
                break;
            case 'TOKEN-MIGRATION-SUCCESS':
                onClose();
                break;
            default:
                onSubmit();
        }
    };

    let title;
    let btnLabel = t('swapModal.buttonConfirm');
    let btnDisable = false;
    switch (status) {
        case 'SUBMIT':
            title = t('swapModal.modalTitle1');
            btnLabel = t('defaultCTA.buttonSubmit');
            break;
        case 'CONFIRM':
            title = t('swapModal.modalTitle2');
            btnLabel = t('defaultCTA.buttonExchange');
            const tpLegacyBalance = new BigNumber(
                Web3.utils.fromWei(
                    auth.userBalanceData.tpLegacy.balance,
                    'ether'
                )
            );
            if (tpLegacyBalance.eq(0)) btnDisable = true;
            break;
        case 'ALLOWANCE-SIGN':
        case 'ALLOWANCE-WAITING':
        case 'ALLOWANCE-ERROR':
            title = t('swapModal.authorizing');
            break;
        case 'TOKEN-MIGRATION-SIGN':
        case 'TOKEN-MIGRATION-WAITING':
        case 'TOKEN-MIGRATION-ERROR':
            title = t('swapModal.migrating');
            break;
        case 'TOKEN-MIGRATION-SUCCESS':
            title = t('swapModal.migrating');
            btnLabel = t('defaultCTA.buttonClose');
            break;
        default:
            title = 'IMPORTANT NOTICE';
            btnLabel = t('defaultCTA.buttonSubmit');
    }

    return (
        <div className="Content">
            <div className="Title">{title}</div>
            <div className="Body">
                {status === 'SUBMIT' && (
                    <div>
                        <p>{t('swapModal.explanation1')}</p>
                        <p>
                            <strong>{t('swapModal.explanation2')}</strong>
                        </p>
                        <p>{t('swapModal.explanation3')}</p>
                    </div>
                )}

                {status === 'CONFIRM' && (
                    <div>
                        <div className="TokenIcon">
                            <img
                                className={''}
                                src={TokenMigratePNG}
                                alt="Token Migrate"
                            />
                        </div>
                        <div className="Summary">
                            <div className="Exchanging">
                                <div className="Label">
                                    {t('swapModal.exchanging')}{' '}
                                </div>
                                <div className="Amount">
                                    <div className="Value">
                                        {PrecisionNumbers({
                                            amount: auth.userBalanceData
                                                .tpLegacy.balance,
                                            token: TokenSettings('TP_0'),
                                            decimals: 4,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="Token">RDOC</div>
                                </div>
                            </div>
                            <div className="Receiving">
                                <div className="Label">
                                    {t('swapModal.receiving')}{' '}
                                </div>
                                <div className="Amount">
                                    <div className="Value">
                                        {PrecisionNumbers({
                                            amount: auth.userBalanceData
                                                .tpLegacy.balance,
                                            token: TokenSettings('TP_0'),
                                            decimals: 4,
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: false
                                        })}
                                    </div>
                                    <div className="Token">USDRIF</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'ALLOWANCE-SIGN' && (
                    <div>
                        <div className="tx-logo-status">
                            <i className="icon-signifier"></i>
                        </div>
                        <p className="Center">
                            {t('swapModal.allowanceSignText')}
                        </p>
                    </div>
                )}

                {status === 'ALLOWANCE-WAITING' && (
                    <div>
                        {/*ALLOWANCE-WAITING*/}
                        <div className="tx-logo-status">
                            <i className="icon-tx-waiting rotate"></i>
                        </div>
                        <p>{t('swapModal.allowanceWaiting')}</p>
                        <p>
                            {t('swapModal.transactionHash')}
                            <Copy
                                textToShow={TruncateAddress(txID)}
                                textToCopy={txID}
                                typeUrl={'tx'}
                            />
                        </p>
                    </div>
                )}

                {status === 'ALLOWANCE-ERROR' && (
                    <div>
                        {' '}
                        {/*ALLOWANCE-ERROR*/}
                        <div className="tx-logo-status">
                            <i className="icon-tx-error"></i>
                        </div>
                        <p className="Center">
                            {t('swapModal.operationFailed')}
                        </p>
                        <p className="Center">
                            {t('swapModal.transactionHash')}
                            <Copy
                                textToShow={TruncateAddress(txID)}
                                textToCopy={txID}
                                typeUrl={'tx'}
                            />
                        </p>
                    </div>
                )}

                {status === 'TOKEN-MIGRATION-SIGN' && (
                    <div>
                        <div className="tx-logo-status">
                            <i className="icon-signifier"></i>
                        </div>
                        <p className="Center">
                            {t('swapModal.migrationTransactionSignText')}
                        </p>
                    </div>
                )}

                {status === 'TOKEN-MIGRATION-WAITING' && (
                    <div>
                        {' '}
                        {/*TOKEN-MIGRATION-WAITING*/}
                        <div className="tx-logo-status">
                            <i className="icon-tx-waiting rotate"></i>
                        </div>
                        <p>{t('swapModal.tokenMigrationWaitingText')}</p>
                        <p>
                            {t('swapModal.transactionHash')}
                            <Copy
                                textToShow={TruncateAddress(txID)}
                                textToCopy={txID}
                                typeUrl={'tx'}
                            />
                        </p>
                    </div>
                )}

                {status === 'TOKEN-MIGRATION-SUCCESS' && (
                    <div>
                        {' '}
                        {/* TOKEN-MIGRATION-SUCCESS */}
                        <div className="tx-logo-status">
                            <i className="icon-tx-success"></i>
                        </div>
                        <p className="Center">
                            {t('swapModal.operationSuccessful')}
                        </p>
                        <p className="Center">
                            {t('swapModal.transactionHash')}
                            <Copy
                                textToShow={TruncateAddress(txID)}
                                textToCopy={txID}
                                typeUrl={'tx'}
                            />
                        </p>
                    </div>
                )}

                {status === 'TOKEN-MIGRATION-ERROR' && (
                    <div>
                        <div className="tx-logo-status">
                            <i className="icon-tx-error"></i>
                        </div>
                        <p className="Center">
                            {t('swapModal.operationFailed')}
                        </p>
                        <p className="Center">
                            {t('swapModal.transactionHash')}
                            <Copy
                                textToShow={TruncateAddress(txID)}
                                textToCopy={txID}
                                typeUrl={'tx'}
                            />
                        </p>
                    </div>
                )}
            </div>
            <div className="cta-container">
                <div className="cta-options-group">
                    {status !== 'TOKEN-MIGRATION-SUCCESS' &&
                        status !== 'ALLOWANCE-WAITING' &&
                        status !== 'TOKEN-MIGRATION-WAITING' &&
                        status !== 'TOKEN-MIGRATION-ERROR' &&
                        status !== 'ALLOWANCE-ERROR' && (
                            <Button
                                type="secondary"
                                className="button secondary"
                                onClick={onClose}
                            >
                                {t('defaultCTA.buttonClose')}
                            </Button>
                        )}
                    {(status === 'SUBMIT' || status === 'CONFIRM') && (
                        <Button
                            className="button"
                            type="primary"
                            disabled={btnDisable}
                            onClick={onConfirm}
                        >
                            {btnLabel}
                        </Button>
                    )}
                    {status === 'TOKEN-MIGRATION-SUCCESS' && (
                        <Button
                            className="button"
                            type="primary"
                            disabled={btnDisable}
                            onClick={onConfirm}
                        >
                            {btnLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SwapToken;
