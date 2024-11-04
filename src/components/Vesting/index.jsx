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
import {
    loadVesting,
    loadVestingAddressesFromLocalStorage,
    saveDefaultVestingToLocalStorage,
    saveVestingAddressesToLocalStorage,
    onValidateVestingAddress
} from '../../helpers/vesting';
import './Styles.scss';

const { TextArea } = Input;
const space = '\u00A0';

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
    const [newVestingAddress, setNewVestingAddress] = useState('');
    const [isHolderVesting, setIsHolderVesting] = useState(false);

    useEffect(() => {
        if (auth.userBalanceData && auth.isVestingLoaded()) {
            setStatus('LOADED');
            setUsingVestingAddress(auth.vestingAddress());
            onValidateWithdraw();
            onCheckIsHolderVesting();
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
        return (
            address.substring(0, 6) +
            '...' +
            address.substring(address.length - 4, address.length)
        );
    };

    const onValidateWithdraw = () => {
        if (!getIsHolderVesting()) {
            setValidWithdraw(false);
            return;
        }
        const availableForWithdraw = new BigNumber(
            auth.userBalanceData.vestingmachine.getAvailable
        );
        if (availableForWithdraw.gt(new BigNumber(0))) {
            if (auth.userBalanceData.vestingmachine.isVerified) {
                setValidWithdraw(true);
            } else {
                setValidWithdraw(false);
            }
        } else {
            setValidWithdraw(false);
        }
    };

    const getIsHolderVesting = () => {
        return (
            auth.userBalanceData.vestingmachine.getHolder.toLowerCase() ===
            auth.accountData.Wallet.toLowerCase()
        );
    };

    const onCheckIsHolderVesting = () => {
        const isHolder = getIsHolderVesting();
        setIsHolderVesting(isHolder);
    };

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
        const lockedAmount = auth.userBalanceData.vestingmachine.getLocked;
        const percentMultiplier = 10000;
        const percentages = getParameters.percentages;
        const timeDeltas = getParameters.timeDeltas;
        const deltas = [...timeDeltas];

        if (timeDeltas && !new BigNumber(timeDeltas[0]).isZero()) {
            deltas.unshift(new BigNumber(0));
        }

        if (new BigNumber(percentages[0]).lt(percentMultiplier)) {
            percentages.unshift(BigInt(10000));
        }

        if (percentages && percentages.length > 0)
            percentages[percentages.length - 1] = 0;

        const percents = percentages.map((x) =>
            new BigNumber(percentMultiplier).minus(x)
        );

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

        amounts.released = new BigNumber(total).minus(
            new BigNumber(lockedAmount)
        );
        amounts.vested = lockedAmount;
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
            .interfaceVestingWithdraw(onTransaction, onReceipt, onError)
            .then((res) => {
                // Refresh status
                auth.loadContractsStatusAndUserBalance().then((value) => {
                    console.log('Refresh user balance OK!');
                });
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
                auth.loadContractsStatusAndUserBalance().then((value) => {
                    console.log('Refresh user balance OK!');
                });
            })
            .catch((e) => {
                console.error(e);
                setOperationStatus('error');
            });
    };

    const onDisplayAccount = () => {
        auth.onShowModalAccountVesting();
    };

    const onValidateIncentiveV2UserBalance = () => {
        let valid = false;
        if (
            auth.userBalanceData &&
            typeof auth.userBalanceData.incentiveV2 !== 'undefined'
        ) {
            if (
                new BigNumber(auth.userBalanceData.incentiveV2.userBalance).gt(
                    new BigNumber(0)
                )
            ) {
                valid = true;
            }
        }
        setValidCreateVM(valid);
    };

    const onClickUseClaimCode = () => {
        setStatus('STEP_2');
    };

    const onChangeClaimCode = (event) => {
        setClaimCode(event.target.value.substring(0, 132));
    };

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
    };

    const onValidateClaimCode = () => {
        let valid = false;

        if (claimCode.length === 132) {
            const claimAddress = recoverMessageClaimCode(claimCode);
            if (claimAddress === auth.accountData.Wallet.toLowerCase())
                valid = true;
        }

        if (!valid && claimCode === '') {
            setValidClaimCode(false);
            setValidClaimCodeError('');
        } else if (!valid) {
            setValidClaimCode(false);
            setValidClaimCodeError(
                t('vesting.vestingOnboarding.page2.feedback.notValid')
            );
        } else {
            setValidClaimCode(true);
            setValidClaimCodeError('');
        }
    };

    const onClickCreateVM = () => {
        setStatus('STEP_3');
    };

    const onVestingCreated = (filteredEvents) => {
        filteredEvents
            .then((results) => {
                results.forEach(function (events) {
                    if (events.name === 'VestingCreated') {
                        events.events.forEach(function (field) {
                            if (field.name === 'vesting') {
                                const vNewAddress = field.value.toLowerCase();
                                setNewVestingAddress(vNewAddress);

                                // set go to step Nº 4
                                setStatus('STEP_4');

                                // Close the modal
                                setIsOperationModalVisible(false);

                                // Add vesting address to storage
                                addVesting(vNewAddress)
                                    .then((results) => {})
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onSendCreateVM = async (e) => {
        setModalTitle(t('vesting.vestingOnboarding.page3.modalTitle'));

        e.stopPropagation();

        setOperationStatus('sign');
        setIsOperationModalVisible(true);

        const onTransaction = (txHash) => {
            console.log('Sent transaction create VM...: ', txHash);
            setTxHash(txHash);
            setOperationStatus('pending');
        };
        const onReceipt = (receipt) => {
            console.log('Transaction create VM mined!...');
            setOperationStatus('success');
            const filteredEvents = auth.interfaceDecodeEvents(receipt);
            onVestingCreated(filteredEvents);
        };
        const onError = (error) => {
            console.log('Transaction create VM error!...:', error);
            setOperationStatus('error');
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
                setOperationStatus('error');
            });
    };

    const loadClaimCodeFromFile = async (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result.substring(0, 132);
            setClaimCode(text);
        };
        reader.readAsText(e.target.files[0]);
    };

    const saveAddressToFile = (address) => {
        const uri =
            'data:text/plain;charset=utf-8,' + encodeURIComponent(address);

        const link = document.createElement('a');
        link.href = uri;
        link.download = 'VestingAddress.txt';
        document.body.appendChild(link);
        link.click();

        // Remueve el enlace del DOM después de la descarga
        document.body.removeChild(link);
    };

    const copyAddressToClipboard = (address) => {
        navigator.clipboard
            .writeText(address)
            .then(() => {
                // console.log('Copied to clipboard', address);
            })
            .catch((err) => {
                // console.error('Error copying to clipboard', err);
            });
    };

    const addVesting = async (addVestingAddress) => {
        const isValidVesting = await onValidateVestingAddress(
            auth,
            addVestingAddress
        );
        if (isValidVesting) {
            const isLoaded = loadVesting(auth, addVestingAddress);
            if (!isLoaded) {
                return false;
            }
            //add on storage
            // get vesting addresses
            const vestingFromStorage = loadVestingAddressesFromLocalStorage(
                auth.accountData.Wallet
            );

            //Add the new one to the list
            vestingFromStorage.push(addVestingAddress);

            // Store vesting addresses
            saveVestingAddressesToLocalStorage(
                auth.accountData.Wallet.toLowerCase(),
                vestingFromStorage
            );
            saveDefaultVestingToLocalStorage(
                auth.accountData.Wallet.toLowerCase(),
                addVestingAddress
            );

            setNewVestingAddress('');

            return true;
        }
    };

    return (
        <div className="section vesting">
            {status === 'LOADED' && (
                <Alert
                    className="alert alert-info"
                    message={t('vesting.alert.title')}
                    description={
                        <div>
                            <div className="address desktop-only">
                                Using VM:{space} {usingVestingAddress}
                            </div>
                            <div className="address mobile-only">
                                Using VM:{space}
                                {truncateAddress(usingVestingAddress)}
                            </div>
                            <div>{t('vesting.alert.explanation')}</div>
                        </div>
                    }
                    type="error"
                    showIcon
                    // closable
                    action={
                        <Button
                            size="small"
                            type="custom"
                            onClick={onDisplayAccount}
                        >
                            {t('vesting.alert.cta')}
                        </Button>
                    }
                />
            )}

            {/*

             VESTING ONBOARDING PAGE 1

             */}
            {status === 'STEP_1' && (
                <div
                    id="vesting-onboarding"
                    className="layout-card section__innerCard--big page1"
                >
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
                            <p id="vestingOnboardingClaimCodeExplanation">
                                {t(
                                    'vesting.vestingOnboarding.page1.explanation2'
                                )}
                            </p>
                            <div className="cta-container">
                                <div className="cta-options-group">
                                    <button
                                        className="button secondary"
                                        onClick={onDisplayAccount}
                                    >
                                        {t(
                                            'vesting.vestingOnboarding.page1.ctaSecondary'
                                        )}
                                    </button>

                                    <button
                                        id="vestingOnboardingUseClaimCode"
                                        className="button"
                                        onClick={onClickUseClaimCode}
                                    >
                                        {t(
                                            'vesting.vestingOnboarding.page1.ctaPrimary'
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div
                                id="vestingOnboardingPagination"
                                className="pagination"
                            >
                                <div className="page-indicator active"></div>
                                <div className="page-indicator"></div>
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
                                        // rows={4}
                                        className="claim-code-input"
                                        placeholder={t(
                                            'vesting.vestingOnboarding.page2.placeholder'
                                        )}
                                        onChange={onChangeClaimCode}
                                        value={claimCode}
                                    />
                                </label>
                            </div>
                            {!validClaimCode && validClaimCodeError !== '' && (
                                <div className="input-error">
                                    {validClaimCodeError}
                                </div>
                            )}
                            <div className="options">
                                <input
                                    id="file-upload"
                                    className="button--small"
                                    type="file"
                                    onChange={loadClaimCodeFromFile}
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="button--small"
                                >
                                    {t(
                                        'vesting.vestingOnboarding.page2.loadButton'
                                    )}
                                </label>
                            </div>
                            <br />
                            <div className="explanation">
                                <p>
                                    {t(
                                        'vesting.vestingOnboarding.page2.explanation1'
                                    )}
                                </p>
                            </div>
                            <div className="cta-container">
                                <div className="cta-options-group">
                                    <button
                                        className="button secondary"
                                        onClick={() => setStatus('STEP_1')}
                                    >
                                        {t(
                                            'vesting.vestingOnboarding.page2.ctaSecondary'
                                        )}
                                    </button>
                                    <button
                                        className="button"
                                        onClick={onClickCreateVM}
                                        disabled={!validClaimCode}
                                    >
                                        {t(
                                            'vesting.vestingOnboarding.page2.ctaPrimary'
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="pagination">
                                <div className="page-indicator"></div>
                                <div className="page-indicator active"></div>
                                <div className="page-indicator"></div>
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
                <div
                    id="vesting-onboarding"
                    className="layout-card section__innerCard--big page3"
                >
                    <div className="layout-card-title">
                        <h1>{t('vesting.cardTitle')}</h1>
                    </div>
                    <div className="layout-card-content">
                        <div className="vesting-content">
                            <div className="vesting-wallet-info">
                                <h2 className="vesting-wallet-label">
                                    {t(
                                        'vesting.vestingOnboarding.page3.stepTitle'
                                    )}
                                </h2>
                                <div className="tx-amount-container">
                                    <div className="vesting-wallet-claim-amount tx-amount-data">
                                        {PrecisionNumbers({
                                            amount: !auth.userBalanceData
                                                ? '0'
                                                : auth.userBalanceData
                                                      .incentiveV2.userBalance,
                                            token: settings.tokens.TG,
                                            decimals: t(
                                                'staking.display_decimals'
                                            ),
                                            t: t,
                                            i18n: i18n,
                                            ns: ns
                                        })}
                                        {t('staking.governanceToken')}
                                    </div>
                                    <div className="tx-amount-info">
                                        {t(
                                            'vesting.vestingOnboarding.page3.amountLabel'
                                        )}
                                    </div>
                                    <div className="tx-direction">
                                        <div className="swapArrow">
                                            <div className="icon-arrow-down"></div>
                                        </div>
                                    </div>
                                    <div className="tx-destination-address">
                                        {auth.accountData.Wallet}
                                    </div>
                                    <div className="tx-amount-info">
                                        {t(
                                            'vesting.vestingOnboarding.page3.ownerLabel'
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="cta-container">
                                <div className="cta-info-group">
                                    <div className="cta-info-detail">
                                        {t(
                                            'vesting.vestingOnboarding.page3.ctaInfo'
                                        )}
                                    </div>
                                </div>
                                <div className="cta-options-group">
                                    <button
                                        className="button secondary"
                                        onClick={() => setStatus('STEP_2')}
                                    >
                                        {t(
                                            'vesting.vestingOnboarding.page3.ctaSecondary'
                                        )}
                                    </button>
                                    <button
                                        className="button"
                                        disabled={!validCreateVM}
                                        onClick={onSendCreateVM}
                                    >
                                        {t(
                                            'vesting.vestingOnboarding.page3.ctaPrimary'
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="pagination">
                                <div className="page-indicator"></div>
                                <div className="page-indicator"></div>
                                <div className="page-indicator active"></div>
                                <div className="page-indicator"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {status === 'STEP_4' && (
                <div
                    id="vesting-onboarding"
                    className="layout-card section__innerCard--big page4 celebrate"
                >
                    <div className="layout-card-title">
                        <h1>{t('vesting.cardTitle')}</h1>
                    </div>
                    <div className="layout-card-content ">
                        <div className="vesting-content">
                            <h2 className="">
                                {t('vesting.vestingOnboarding.page4.stepTitle')}
                            </h2>
                            <div className="success-message">
                                {t(
                                    'vesting.vestingOnboarding.page4.successMessage'
                                )}
                            </div>
                            <div className="tx-amount-container">
                                <div className="tx-destination-address">
                                    {newVestingAddress}
                                </div>
                                <div className="tx-amount-info">
                                    {t(
                                        'vesting.vestingOnboarding.page4.addressLabel'
                                    )}
                                </div>
                            </div>
                            <div className="options">
                                <input
                                    id="file-download"
                                    className="button--small"
                                    // type="file"
                                    onClick={() =>
                                        saveAddressToFile(newVestingAddress)
                                    }
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="file-download"
                                    className="button--small"
                                >
                                    {t(
                                        'vesting.vestingOnboarding.page4.buttonDownloadAddress'
                                    )}
                                </label>
                                <input
                                    id="copy-code"
                                    className="button--small"
                                    // type="file"
                                    onClick={() =>
                                        copyAddressToClipboard(
                                            newVestingAddress
                                        )
                                    }
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="copy-code"
                                    className="button--small"
                                >
                                    {t(
                                        'vesting.vestingOnboarding.page4.buttonCopyAddress'
                                    )}
                                </label>
                            </div>
                            <div className="cta-container">
                                <div className="cta-info-group">
                                    <div className="cta-info-detail">
                                        {t(
                                            'vesting.vestingOnboarding.page4.ctaInfo'
                                        )}
                                    </div>
                                </div>
                                <div className="cta-options-group">
                                    <button
                                        className="button secondary"
                                        onClick={() => setStatus('STEP_3')}
                                    >
                                        {t(
                                            'vesting.vestingOnboarding.page4.ctaSecondary'
                                        )}
                                    </button>
                                    <button
                                        className="button"
                                        onClick={onClickAddVesting}
                                        disabled={newVestingAddress === ''}
                                    >
                                        {t(
                                            'vesting.vestingOnboarding.page4.ctaPrimary'
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="pagination">
                                <div className="page-indicator"></div>
                                <div className="page-indicator"></div>
                                <div className="page-indicator"></div>
                                <div className="page-indicator active"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/*

             VESTING SCHEDULE

             */}
            {window.dContracts.contracts.VestingMachine !== undefined &&
                status === 'LOADED' && (
                    <div className="vesting">
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
                                            .isVerified &&
                                        isHolderVesting && (
                                            <div
                                                className={
                                                    'vesting__verification__status--OwnedWallet'
                                                }
                                            >
                                                <div className="verification-icon--ownedWallet"></div>
                                                {t('vesting.status.verified')}
                                            </div>
                                        )}
                                    {!isHolderVesting && (
                                        <div
                                            className={
                                                'vesting__verification__status--notOwnedWallet'
                                            }
                                        >
                                            <div className="verification-icon--notOwnedWallet"></div>
                                            {t(
                                                'vesting.status.notFromThisUser'
                                            )}
                                        </div>
                                    )}
                                    {auth.userBalanceData &&
                                        !auth.userBalanceData.vestingmachine
                                            .isVerified &&
                                        isHolderVesting && (
                                            <div
                                                className={
                                                    'vesting__verification__status'
                                                }
                                            >
                                                <div className="verification-icon"></div>
                                                {t(
                                                    'vesting.status.notVerified'
                                                )}
                                                <a
                                                    className={'verify__button'}
                                                    onClick={onVerify}
                                                >
                                                    {t(
                                                        'vesting.status.verifyCTA'
                                                    )}
                                                </a>
                                                <div className="icon__button__arrow"></div>
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
                                                      .vestingmachine
                                                      .getAvailable,
                                            token: settings.tokens.TG,
                                            decimals: t(
                                                'staking.display_decimals'
                                            ),
                                            t: t,
                                            i18n: i18n,
                                            ns: ns
                                        })}
                                    </div>
                                    <div className="vesting__label">
                                        {t('vesting.tokensAvailableToWithdraw')}
                                    </div>
                                </div>
                                <button
                                    id="withdraw-cta"
                                    onClick={onWithdraw}
                                    disabled={!validWithdraw}
                                >
                                    {t('vesting.withdrawToWallet')}
                                    <div className="icon__button__arrow"></div>
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
                                    {t(
                                        'vesting.dashDistribution.daysToRelease'
                                    )}
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
                                            : auth.userBalanceData
                                                  .vestingmachine.staking
                                                  .balance,
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
                                            : auth.userBalanceData
                                                  .vestingmachine.delay.balance,
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
                                <h1>
                                    {' '}
                                    {t('vesting.releaseSchedule.cardTitle')}
                                </h1>
                            </div>
                            <div id="moc-total">
                                <div className="total-data">
                                    {PrecisionNumbers({
                                        amount: !auth.userBalanceData
                                            ? '0'
                                            : auth.userBalanceData
                                                  .vestingmachine.getTotal,
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
