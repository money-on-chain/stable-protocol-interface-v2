import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, notification, Space, Input } from 'antd';
import VestingSchedule from '../../components/Tables/VestingSchedule';
import settings from '../../settings/settings.json';
import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';
import { PrecisionNumbers } from '../PrecisionNumbers';
import BigNumber from 'bignumber.js';
import { formatTimestamp } from '../../helpers/staking';
import OperationStatusModal from '../Modals/OperationStatusModal/OperationStatusModal';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import CopyAddress from '../CopyAddress';


const { TextArea } = Input;


export default function Vesting(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const [status, setStatus] = useState('STEP_1');
    const [isOperationModalVisible, setIsOperationModalVisible] =
        useState(false);
    const [txHash, setTxHash] = useState('');
    const [operationStatus, setOperationStatus] = useState('sign');
    const [modalTitle, setModalTitle] = useState('Operation status');
    const [usingVestingAddress, setUsingVestingAddress] = useState('');
    const [validWithdraw, setValidWithdraw] = useState(false);
    const [claimCode, setClaimCode] = useState('');
    const [validClaimCode, setValidClaimCode] = useState(false);
    const [validClaimCodeError, setValidClaimCodeError] = useState('');
    const [validCreateVM, setValidCreateVM] = useState(false);
    const [txClaimStatus, setTxClaimStatus] = useState('WALLET-INFO');
    const [txClaimID, setTxClaimID] = useState('');
    const [newVestingAddress, setNewVestingAddress] = useState('');

    useEffect(() => {
        if (auth.userBalanceData && auth.isVestingLoaded()) {
            setStatus('LOADED');
            setUsingVestingAddress(auth.vestingAddress());
            onValidateWithdraw();
        } else {
            // Reset in case the previous status is Loaded, this occurs when switch off vesting in account
            if (status === 'LOADED') setStatus('STEP_1');
        }

        // Validate incentive user balance
        onValidateIncentiveV2UserBalance();

    }, [auth]);

    useEffect(() => {
        onValidateClaimCode();
    }, [claimCode]);

    const truncateAddress = (address) => {
        return address.substring(0, 6) +  '...' +  address.substring(address.length - 4, address.length);
    }

    const onValidateWithdraw = () => {
        const availableForWithdraw = new BigNumber(auth.userBalanceData.vestingmachine.getAvailable)
        if (availableForWithdraw.gt(new BigNumber(0))) {
            if (auth.userBalanceData.vestingmachine.isVerified) {
                setValidWithdraw(true);
            } else {
                setValidWithdraw(false);
            }
        } else {
            setValidWithdraw(false);
        }
    }

    const onValidateIncentiveV2UserBalance = () => {
        let valid = false;
        if (auth.userBalanceData && typeof auth.userBalanceData.incentiveV2 !== 'undefined') {
            if (new BigNumber(auth.userBalanceData.incentiveV2.userBalance).gt(new BigNumber(0))) {
                valid = true;
            }
        }
        setValidCreateVM(valid);
    }

    const onClickUseClaimCode = () => {
        setStatus('STEP_2');
    }

    const onChangeClaimCode = (event) => {
        setClaimCode(event.target.value);
    }

    const recoverMessageClaimCode = (message) => {

        const chainId = process.env.REACT_APP_ENVIRONMENT_CHAIN_ID;
        const userAddress = auth.accountData.Wallet;
        const fromAddress = userAddress.slice(2);
        const code = `:OMoC:${chainId}:address:${fromAddress}`;

        let recoveredAddress = '';

        try {
            recoveredAddress = auth.web3.eth.accounts.recover(code, message);
        } catch (err) {
            console.error(err);
        }

        return recoveredAddress.toLowerCase();
    }

    const onValidateClaimCode = () => {
        let valid = false;

        if (claimCode.length === 132) {
            const claimAddress = recoverMessageClaimCode(claimCode);
            if (claimAddress === auth.accountData.Wallet.toLowerCase()) valid = true;
        }

        if (!valid && claimCode === '') {
            setValidClaimCode(false);
            setValidClaimCodeError('');
        } else if (!valid) {
            setValidClaimCode(false);
            setValidClaimCodeError('Not valid claim code. You need to claim with the original address');
        } else {
            setValidClaimCode(true);
            setValidClaimCodeError('');
        }

    }

    const onClickLoadClaimCode = () => {

    }

    const onClickCreateVM = () => {
        setStatus('STEP_3');
    }

    const vestedAmounts = () => {

        const amounts = {};

        if (!auth.isVestingLoaded()) {
            amounts.released = new BigNumber(0);
            amounts.vested = new BigNumber(0);
            amounts.total = new BigNumber(0);
            return amounts;
        }

        const getParameters = auth.userBalanceData.vestingmachine.getParameters;
        const tgeTimestamp =
            auth.userBalanceData.vestingfactory.getTGETimestamp;
        const total = auth.userBalanceData.vestingmachine.getTotal;
        const percentMultiplier = 10000;
        const percentages = getParameters.percentages;

        const timeDeltas = getParameters.timeDeltas;
        const deltas = [...timeDeltas];
        if (timeDeltas && !new BigNumber(timeDeltas[0]).isZero()) {
            deltas.unshift(new BigNumber(0));
        }

        const percents = percentages.map((x) =>
            new BigNumber(percentMultiplier).minus(x)
        );
        if (
            percentages &&
            !new BigNumber(percentages[percentages.length - 1]).isZero()
        ) {
            percents.push(new BigNumber(percentMultiplier));
        }

        let dates = [];
        if (deltas) {
            if (tgeTimestamp) {
                // Convert timestamp to date.
                dates = deltas.map((x) =>
                    formatTimestamp(
                        new BigNumber(tgeTimestamp)
                            .plus(x)
                            .times(1000)
                            .toNumber()
                    )
                );
            } else {
                dates = deltas.map((x) => x / 60 / 60 / 24);
            }
        }

        let vestedAmount = new BigNumber(0);
        let releasedAmount = new BigNumber(0);
        let daysToRelease = 0;
        let countVested = 0;

        auth.userBalanceData &&
            getParameters &&
            percents.forEach(function (percent, itemIndex) {
                const date_release = new Date(dates[itemIndex]);
                const date_now = new Date();
                const timeDifference =
                    date_release.getTime() - date_now.getTime();
                const dayLefts = Math.round(
                    timeDifference / (1000 * 3600 * 24)
                );

                let amount = new BigNumber(0);
                if (total && !new BigNumber(total).isZero()) {
                    amount = new BigNumber(percent)
                        .times(total)
                        .div(percentMultiplier);
                }

                if (dayLefts > 0) {
                    vestedAmount = amount;
                    if (countVested === 0) {
                        daysToRelease = dayLefts;
                        countVested += 1;
                    }
                } else {
                    releasedAmount = amount;
                }
            });

        amounts.released = releasedAmount;
        amounts.vested = vestedAmount; //vestedAmount.minus(releasedAmount);
        amounts.total = total;
        amounts.daysToRelease = daysToRelease;

        return amounts;
    };

    const vestingTotals = vestedAmounts();

    const onWithdraw = async (e) => {
        setModalTitle('Withdraw transaction');

        e.stopPropagation();

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction withdraw...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = () => {
            console.log('Transaction withdraw mined!...');
            setOperationStatus('success');
        };
        const onError = (error) => {
            console.log('Transaction withdraw error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVestingWithdraw(
                new BigNumber(1),
                onTransaction,
                onReceipt,
                onError
            )
            .then((res) => {
                // Refresh status
                auth.loadContractsStatusAndUserBalance().then(
                    (value) => {
                        console.log('Refresh user balance OK!');
                    }
                );
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    const onVerify = async (e) => {
        e.stopPropagation();

        setModalTitle('Verification transaction');

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction verify...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = () => {
            console.log('Transaction verify mined!...');
            setOperationStatus('success');
        };
        const onError = (error) => {
            console.log('Transaction verify error!...:', error);
            setOperationStatus('error');
        };

        await auth
            .interfaceVestingVerify(onTransaction, onReceipt, onError)
            .then((res) => {
                // Refresh status
                auth.loadContractsStatusAndUserBalance().then(
                    (value) => {
                        console.log('Refresh user balance OK!');
                    }
                );
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    const onDisplayAccount = () => {
        auth.onShowModalAccount();
    }

    const onVestingCreated = (filteredEvents) => {
        console.log("DEBUG")
        console.log(filteredEvents)
        filteredEvents
            .then((results) => {
                results.forEach(function (events) {
                    if (events.name === 'VestingCreated') {
                        events.events.forEach(function (field) {
                            if (field.name === 'vesting') {
                                setNewVestingAddress(field.value);
                                setTxClaimStatus('VESTING-CREATED');
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const onSendCreateVM = async () => {
        setTxClaimStatus('SIGN');

        const onTransaction = (txHash) => {
            console.log('Sent transaction create VM...: ', txHash);
            setTxClaimID(txHash);
            setTxClaimStatus('PENDING');
        };
        const onReceipt = async (receipt) => {
            console.log('Transaction create VM mined!...');
            setTxClaimStatus('SUCCESS');
            const filteredEvents = await auth.interfaceDecodeEvents(receipt);
            onVestingCreated(filteredEvents);
        };
        const onError = (error) => {
            console.log('Transaction create VM error!...:', error);
            setTxClaimStatus('ERROR');
        };

        await auth
            .interfaceIncentiveV2Claim(
                claimCode,
                onTransaction,
                onReceipt,
                onError
            )
            .then((res) => {
                // Refresh status
                /*auth.loadContractsStatusAndUserBalance().then(
                    (value) => {
                        console.log('Refresh user balance OK!');
                    }
                );*/
            })
            .catch((e) => {
                console.error(e);
                setTxClaimStatus('ERROR');
            });

    }

    let sentIcon = '';
    let statusLabel = '';
    switch (txClaimStatus) {
        case 'SIGN':
            sentIcon = 'icon-signifier';
            statusLabel = t('exchange.confirm.sign');
            break;
        case 'PENDING':
            sentIcon = 'icon-tx-waiting';
            statusLabel = t('exchange.confirm.queuing');
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
            sentIcon = 'icon-tx-waiting';
            statusLabel = t('exchange.confirm.default');
    }

    return (
        <div className="section vesting">
            {/* <Alert
                className="alert-success"
                message="Success Tips"
                description="This is a warning notice about copywriting."
                type="success"
                showIcon
                closable
            />{' '}
            <Alert className="alert-info" message={t('vesting.alert.cta')} description={t('vesting.alert.cta')} type="info" showIcon closable />{' '}
            <Alert
                className="alert-warning"
                message="Warning Tips"
                description="This is a warning notice about copywriting."
                type="warning"
                showIcon
                closable
            />{' '}
            <Alert
                className="alert-error"
                message="Error Tips"
                description="This is a warning notice about copywriting."
                type="error"
                showIcon
                closable
            />{' '}
             */}
            {/* <div className="layout-card using-vesting-alert">
                {' '}
                <div className="content">
                    <div className="alert-icon"></div>
                    <div className="info">
                        <h2>{t('vesting.alert.title')}</h2>
                        <p>{t('vesting.alert.explanation')}</p>
                    </div>
                </div>
                <div className="wallet-button">{t('vesting.alert.cta')}</div>
            </div> */}{' '}

            {status === 'LOADED' && (
                <Alert
                    className="alert-permanent"
                    message={t('vesting.alert.title')}
                    description={t('vesting.alert.explanation') + '. Vesting: ' + truncateAddress(usingVestingAddress)}
                    type="error"
                    showIcon
                    // closable
                    action={
                        <Button size="small" type="custom" onClick={onDisplayAccount}>
                            {t('vesting.alert.cta')}
                        </Button>
                    }
                /> )}

            {/*

             VESTING ONBOARDING PAGE 1

             */}
            {status === 'STEP_1' && (
                <div
                    id="vesting-onboarding"
                    className="layout-card section__innerCard--big page1"
                >
                    {' '}
                    <div className="layout-card-title">
                        <h1>{t('vesting.cardTitle')}</h1>
                    </div>
                    <div className="layout-card-content">
                        <div className="vesting-content">
                            <h2>
                                {t('vesting.vestingOnboarding.page1.stepTitle')}
                            </h2>
                            <p>
                                {t(
                                    'vesting.vestingOnboarding.page1.explanation1'
                                )}
                            </p>
                            <p>
                                {t(
                                    'vesting.vestingOnboarding.page1.explanation2'
                                )}
                            </p>
                            <div className="cta">
                                <button className="button secondary" onClick={onDisplayAccount}>
                                    {t(
                                        'vesting.vestingOnboarding.page1.ctaSecondary'
                                    )}
                                </button>
                                {(typeof process.env.REACT_APP_CONTRACT_INCENTIVE_V2 !== 'undefined') && (<button className="button" onClick={onClickUseClaimCode}>
                                    {t(
                                        'vesting.vestingOnboarding.page1.ctaPrimary'
                                    )}
                                </button>)}
                            </div>
                            <div className="pagination">
                                <div className="page-indicator active"></div>
                                <div className="page-indicator"></div>
                                <div className="page-indicator"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/*

             INCENTIVE USE CLAIM CODE INPUT CLAIM CODE & VERIFICATION

             */}
            {status === 'STEP_2' && (
                <div
                    id="vesting-onboarding"
                    className="layout-card section__innerCard--big page2"
                >
                    <div className="layout-card-title">
                        <h1>{t('vesting.cardTitle')}</h1>
                    </div>
                    <div className="layout-card-content">
                        <div className="vesting-content">
                            <h2>
                                {t('vesting.vestingOnboarding.page2.stepTitle')}
                            </h2>
                            <div className="input-container">
                                <label className="claim-code-input-label">
                                    {t('vesting.vestingOnboarding.page2.label')}
                                    <TextArea
                                        rows={4}
                                        className="claim-code-input"
                                        placeholder={t(
                                            'vesting.vestingOnboarding.page2.placeholder'
                                        )}
                                        onChange={onChangeClaimCode}
                                    />
                                </label>
                            </div>
                            {!validClaimCode && validClaimCodeError !=='' && (<div className="input-error">
                                {validClaimCodeError}
                            </div>)}
                            <div className="options">
                                <button className="button--small" onClick={onClickLoadClaimCode}>
                                    {t(
                                        'vesting.vestingOnboarding.page2.loadButton'
                                    )}
                                </button>
                            </div>
                            <br />
                            <div className="explanation">
                                <p>
                                    {t(
                                        'vesting.vestingOnboarding.page2.explanation1'
                                    )}
                                </p>
                            </div>
                            <div className="cta">
                                <button className="button secondary" onClick={() => setStatus('STEP_1')}>
                                    {t(
                                        'vesting.vestingOnboarding.page2.ctaSecondary'
                                    )}
                                </button>
                                <button className="button" onClick={onClickCreateVM} disabled={!validClaimCode}>
                                    {t(
                                        'vesting.vestingOnboarding.page2.ctaPrimary'
                                    )}
                                </button>
                            </div>
                            <div className="pagination">
                                <div className="page-indicator"></div>
                                <div className="page-indicator active"></div>
                                <div className="page-indicator"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/*

            INCENTIVE V2 USE CLAIM CODE CORROBORATE BALANCE

            */}
            {status === 'STEP_3' && (
                <div id="vesting-onboarding" className="layout-card page3">
                    {' '}
                    <div className="layout-card-title">
                        <h1>Verify Information</h1>
                    </div>
                    <div className="layout-card-content">
                        <div className='vesting-content'>

                            {txClaimStatus === 'WALLET-INFO' && (<div className='vesting-wallet-info'>
                                <div className="vesting-wallet-label">
                                    Your Address
                                </div>
                                <div className="vesting-wallet-address">
                                    {auth.accountData.Wallet}
                                </div>
                                <div className="vesting-wallet-claim-label">
                                    Tokens to Claim to the vesting
                                </div>
                                <div className="vesting-wallet-claim-amount">
                                    {PrecisionNumbers({
                                        amount: !auth.userBalanceData
                                            ? '0'
                                            : auth.userBalanceData
                                                .incentiveV2.userBalance,
                                        token: settings.tokens.TG,
                                        decimals: t('staking.display_decimals'),
                                        t: t,
                                        i18n: i18n,
                                        ns: ns
                                    })}

                                    {t('staking.governanceToken')}
                                </div>
                            </div>)}


                            {(txClaimStatus === 'PENDING' || txClaimStatus === 'SUCCESS' || txClaimStatus === 'ERROR') && (
                                <div className='tx-details'>
                                    {t(
                                        'vesting.vestingOnboarding.page3.transactionId'
                                    )}
                                    <div className='copy-button'>
                                        <CopyAddress
                                            address={txClaimID}
                                            type={'tx'}
                                        ></CopyAddress>
                                        {/*oxba8cd957…72adM
                                    <div className='copy-icon'></div>*/}
                                    </div>
                                </div>)}

                            {(txClaimStatus === 'SIGN' || txClaimStatus === 'PENDING' || txClaimStatus === 'SUCCESS' || txClaimStatus === 'ERROR') && (
                                <div className='tx-feedback-container'>
                                <div className='tx-feedback-icon'>
                                    <div className={sentIcon}></div>
                                </div>
                                <div className='tx-feedback-text'>{statusLabel}</div>
                            </div>)}

                            {txClaimStatus === 'VESTING-CREATED' && (<div className='vesting-info-created'>
                                <div className='vesting-new-label'>New Vesting Address</div>
                                <div className='vesting-new-address'>{newVestingAddress}</div>
                                <div className='vesting-new-warning'>Please write down vesting address for future use</div>
                            </div>)}

                            <div className='cta'>
                            <button className='button secondary' onClick={() => setStatus('STEP_2')}>
                                    {t(
                                        'vesting.vestingOnboarding.page2.ctaSecondary'
                                    )}
                                </button>
                                <button className='button' disabled={!validCreateVM || txClaimStatus === 'SIGN' || txClaimStatus === 'PENDING' || txClaimStatus === 'SUCCESS' || txClaimStatus === 'ERROR'} onClick={onSendCreateVM}>
                                    Create VM
                                </button>
                            </div>

                            <div className='pagination'>
                                <div className='page-indicator'></div>
                                <div className='page-indicator'></div>
                                <div className='page-indicator active'></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/*

             VESTING SCHEDULE

             */}
            {(window.dContracts.contracts.VestingMachine !== undefined) && (status === 'LOADED') && (
                <div className='vesting'>
                    <div
                        id="vesting-info"
                        className={'layout-card section__innerCard--small'}
                    >
                        {/* <div className="layout-card-title"> */}
                        {/* <div id="vesting-info" className="layout-card"> */}
                        <div className="layout-card-title">
                            <h1>{t('vesting.cardTitle')}</h1>
                            <div id="vesting-verification">
                                {auth.userBalanceData &&
                                    auth.userBalanceData.vestingmachine
                                        .isVerified && (
                                        <div
                                            className={
                                                'vesting__verification__status'
                                            }
                                        >
                                            <div className="verification-icon"></div>
                                            {t('vesting.status.verified')}
                                        </div>
                                    )}
                                {auth.userBalanceData &&
                                    !auth.userBalanceData.vestingmachine
                                        .isVerified && (
                                        <div
                                            className={
                                                'vesting__verification__status'
                                            }
                                        >
                                            <div className="verification-icon"></div>
                                            {t('vesting.status.notVerified')}
                                            <a
                                                className={'click-verify'}
                                                onClick={onVerify}
                                            >
                                                Verify vesting!
                                            </a>
                                        </div>
                                    )}
                            </div>
                        </div>
                        <div id="vesting-info-content">
                            <div>
                                <div
                                    id="vesting-moc-available"
                                    className="vesting__data"
                                >
                                    {PrecisionNumbers({
                                        amount: !auth.userBalanceData
                                            ? '0'
                                            : auth.userBalanceData
                                                  .vestingmachine.getAvailable,
                                        token: settings.tokens.TG,
                                        decimals: t('staking.display_decimals'),
                                        t: t,
                                        i18n: i18n,
                                        ns: ns
                                    })}
                                </div>
                                <div className="vesting__label">
                                    {t('vesting.tokensAvailableToWithdraw')}
                                </div>
                            </div>
                            <button id="withdraw-cta" onClick={onWithdraw} disabled={!validWithdraw}>
                                {t('vesting.withdrawToWallet')}
                                <div className="withdraw-button"></div>
                            </button>
                        </div>
                    </div>
                    {/* </div>{' '} */}
                    <div
                        id="vesting-distribution"
                        className="layout-card section__innerCard--small"
                    >
                        <div id="moc-ready">
                            <div
                                id="vestingDash-readyToWithdraw"
                                className="vesting__data"
                            >
                                {PrecisionNumbers({
                                    amount: !auth.userBalanceData
                                        ? '0'
                                        : vestingTotals['vested'],
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}
                            </div>
                            <div className="vesting__label">
                                {t('vesting.dashDistribution.vested')}
                            </div>
                        </div>
                        <div id="dashboard">
                            <div
                                id="vestingDash-vested"
                                className="vesting__data"
                            >
                                {vestingTotals['daysToRelease']}{' '}
                            </div>
                            <div className="vesting__label">
                                {t('vesting.dashDistribution.daysToRelease')}
                            </div>
                        </div>
                        <div id="moc3">
                            <div
                                id="vestingDash-staked"
                                className="vesting__data"
                            >
                                {PrecisionNumbers({
                                    amount: !auth.userBalanceData
                                        ? '0'
                                        : auth.userBalanceData.vestingmachine
                                              .staking.balance,
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}{' '}
                            </div>
                            <div className="vesting__label">
                                {t('vesting.dashDistribution.staked')}
                            </div>
                        </div>
                        <div id="moc4">
                            <div
                                id="estingDash-unstaking"
                                className="vesting__data"
                            >
                                {PrecisionNumbers({
                                    amount: !auth.userBalanceData
                                        ? '0'
                                        : auth.userBalanceData.vestingmachine
                                              .delay.balance,
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}
                            </div>
                            <div className="vesting__label">
                                {t('vesting.dashDistribution.unstaking')}
                            </div>
                        </div>
                    </div>
                    {/* </div>{' '} */}
                    <div
                        id="vesting-schedudle"
                        className="layout-card section__innerCard--big"
                    >
                        <div className="layout-card-title">
                            <h1> {t('vesting.releaseSchedule.cardTitle')}</h1>
                        </div>
                        <div id="moc-total">
                            <div className="total-data">
                                {PrecisionNumbers({
                                    amount: !auth.userBalanceData
                                        ? '0'
                                        : auth.userBalanceData.vestingmachine
                                              .getTotal,
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns
                                })}
                                {t('staking.tokens.TG.abbr', { ns: ns })}
                            </div>
                            <div className="vesting__label">
                                {t('vesting.releaseSchedule.scheduled')}
                            </div>
                        </div>
                        <div id="vesting-schedule-table">
                            <VestingSchedule />
                        </div>
                    </div>
                </div>
            )}
            {isOperationModalVisible && (
                <OperationStatusModal
                    title={modalTitle}
                    visible={isOperationModalVisible}
                    onCancel={() => setIsOperationModalVisible(false)}
                    operationStatus={operationStatus}
                    txHash={txHash}
                />
            )}
        </div>
    );
}
