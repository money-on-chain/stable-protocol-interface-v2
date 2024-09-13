import { Modal, Button, Spin, notification, Checkbox } from 'antd';
import React, { useEffect, useState, useContext, Fragment } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Web3 from 'web3';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import BigNumber from 'bignumber.js';
import settings from '../../../settings/settings.json';

export default function StakingOptionsModal(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n, ns] = useProjectTranslation();
    const { accountData = {} } = auth;
    const { mode, onClose, visible, amount, onConfirm, withdrawalId } = props;

    const [step, setStep] = useState(0);
    const amountInEth = Web3.utils.toWei(amount, 'ether');
    let infinityAllowance = false;

    useEffect(() => {
        checkAllowance();
    }, []);

    const onChangeInfinity = (e) => {
        console.log(`checked = ${e.target.checked}`);
        infinityAllowance = e.target.checked;
    };

    const checkAllowance = async () => {
        if (auth.accountData && auth.userBalanceData) {
            const allowanceAmount = auth.isVestingLoaded()
                ? auth.userBalanceData.vestingmachine.staking.allowance
                : auth.userBalanceData.stakingmachine.tgAllowance;

            if (allowanceAmount > amountInEth) setStep(3);
        }
    };

    if (!mode) return null;

    //methods
    const setAllowance = async () => {
        setStep(1);

        let amountAllowance;
        if (infinityAllowance) {
            amountAllowance = new BigNumber(100000000000);
        } else {
            amountAllowance = amount;
        }

        const onTransaction = (txHash) => {
            console.log('Sent transaction allowance...: ', txHash);
            setStep(2);
        };
        const onReceipt = () => {
            console.log('Transaction allowance mined!...');
        };
        const onError = (error) => {
            console.log('Transaction allowance error!...:', error);
        };

        await auth
            .interfaceStakingApprove(
                amountAllowance,
                onTransaction,
                onReceipt,
                onError
            )
            .then((res) => {
                setStep(3);
                return null;
            })
            .catch((e) => {
                console.error(e);
                notification['error']({
                    message: 'Operations',
                    description: 'Something went wrong! Transaction rejected!',
                    duration: 10
                });
            });
    };

    const addStake = async () => {
        onClose();
        onConfirm('sign', '');
        const onTransaction = (txHash) => {
            console.log('Sent transaction add stake...');
            onConfirm('pending', txHash);
        };
        const onReceipt = () => {
            console.log('Transaction add stake mined!...');
        };
        const onError = (error) => {
            console.log('Transaction add stake error!...:', error);
        };
        setStep(99);
        await auth
            .interfaceStakingAddStake(
                amount,
                accountData.Wallet,
                onTransaction,
                onReceipt,
                onError
            )
            .then((res) => {
                const status = res.status ? 'success' : 'error';
                onConfirm(status, res.transactionHash);
                return null;
            })
            .catch((e) => {
                notification['error']({
                    message: t('global.RewardsError_Title'),
                    description: t('global.RewardsError_Message'),
                    duration: 10
                });
                onConfirm('error', '');
            });
    };

    const CancelWithdraw = async () => {
        onClose();
        onConfirm('sign', '');
        const onTransaction = (txHash) => {
            console.log('Sent cancel withdraw ...: ', txHash);
            onConfirm('pending', txHash);
        };
        const onReceipt = () => {
            console.log('Transaction cancel withdraw mined!...');
        };
        const onError = (error) => {
            console.log('Transaction cancel withdraw error!...:', error);
        };
        await auth
            .interfaceStakingDelayMachineCancelWithdraw(
                withdrawalId,
                onTransaction,
                onReceipt,
                onError
            )
            .then((res) => {
                const status = res.status ? 'success' : 'error';
                onConfirm(status, res.transactionHash);
                return null;
            })
            .catch((e) => {
                console.error(e);
                notification['error']({
                    message: t('global.RewardsError_Title'),
                    description: t('global.RewardsError_Message'),
                    duration: 10
                });
                onConfirm('error', '');
            });
    };

    const UnStake = async () => {
        onClose();
        onConfirm('sign', '');
        const onTransaction = (txHash) => {
            console.log('Sent transaction unStake...: ', txHash);
            onConfirm('pending', txHash);
        };
        const onReceipt = () => {
            console.log('Transaction unStake mined!...');
        };
        const onError = (error) => {
            console.log('Transaction unStake error!...:', error);
        };
        await auth
            .interfaceStakingUnStake(amount, onTransaction, onReceipt, onError)
            .then((res) => {
                const status = res.status ? 'success' : 'error';
                onConfirm(status, res.transactionHash);
                return null;
            })
            .catch((e) => {
                console.error('error unstaking is', e);
                notification['error']({
                    message: t('global.RewardsError_Title'),
                    description: t('global.RewardsError_Message'),
                    duration: 10
                });
                onConfirm('error', '');
            });
    };

    const withdraw = () => {
        onClose();

        onConfirm('sign', '');
        const onTransaction = (txHash) => {
            console.log('Sent withdraw...: ', txHash);
            onConfirm('pending', txHash);
        };
        const onReceipt = () => {
            console.log('Transaction withdraw mined!...');
        };
        const onError = (error) => {
            console.log('Transaction withdraw error!...:', error);
        };
        auth.interfaceStakingDelayMachineWithdraw(
            withdrawalId,
            onTransaction,
            onReceipt,
            onError
        )
            .then((res) => {
                const status = res.status ? 'success' : 'error';
                onConfirm(status, res.transactionHash);
                return null;
            })
            .catch((e) => {
                console.error(e);
                notification['error']({
                    message: t('global.RewardsError_Title'),
                    description: t('global.RewardsError_Message'),
                    duration: 10
                });
                onConfirm('error', '');
            });
    };

    // renders
    const renderStaking = () => {
        const steps = {
            0: () => {
                return (
                    <Fragment>
                        {/* Asks user to authorize governance tokens */}
                        <div className="">
                            <h1 className="">
                                {t('allowance.cardTitle')}
                                {'  '} {'  '}
                                {t('staking.tokens.TG.label')}
                            </h1>
                            <div className="modal-content">
                                <div className="tx-info-container">
                                    <p>{t('allowance.statusText1')}</p>{' '}
                                    <p>{t('allowance.statusText2')}</p>
                                </div>
                                <div className="tx-options-container">
                                    <Checkbox
                                        className="check-unlimited"
                                        onChange={onChangeInfinity}
                                    >
                                        {t('allowance.setUnlimited')}
                                    </Checkbox>
                                </div>
                                <div className="cta-container">
                                    <div className="cta-options-group">
                                        <Button
                                            type="secondary"
                                            className="button secondary"
                                            onClick={setAllowance}
                                        >
                                            {t('allowance.confirm.cancel')}
                                        </Button>
                                        <Button
                                            type="primary"
                                            className="button"
                                            onClick={setAllowance}
                                        >
                                            {t('allowance.confirm.authorize')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                );
            },
            1: () => {
                return (
                    <Fragment>
                        {/* Asks user to sign authorization transaction on the wallet */}
                        <div className="AllowanceDialog">
                            <h1>
                                {t('allowance.cardTitle')}
                                {'  '}
                                {'  '}
                                {t('staking.tokens.TG.label')}
                            </h1>
                            <div className="modal-content">
                                <div className="tx-feedback-container">
                                    <p className="status-text">
                                        {t('allowance.feedback.sign')}
                                    </p>
                                    <div className="tx-feedback-icon icon-tx-signWallet"></div>{' '}
                                </div>

                                <div className="cta-container">
                                    {' '}
                                    <div className="tx-cta-buttons">
                                        <Button
                                            type="secondary"
                                            className="button secondary"
                                            onClick={setAllowance}
                                        >
                                            {t('allowance.confirm.cancel')}
                                        </Button>
                                    </div>{' '}
                                </div>
                            </div>
                        </div>
                    </Fragment>
                );
            },
            2: () => {
                return (
                    <Fragment>
                        {/* Authorization is being mined, asks the user to wait */}
                        <div className="AllowanceDialog">
                            <h1>
                                {t('allowance.cardTitle')}
                                {'  '}
                                {'  '}
                                {t('staking.tokens.TG.label')}
                            </h1>{' '}
                            <div className="tx-amount-group">
                                <div className="StakingOptionsModal_Content AllowanceLoading">
                                    <p>{t('allowance.feedback.waiting')}</p>
                                </div>
                                <div className="icon-tx-waiting"></div>
                                <div className="cta-container">
                                    <div className="cta-options-group">
                                        <Button
                                            type="secondary"
                                            className="button secondary"
                                            onClick={setAllowance}
                                        >
                                            {t('allowance.confirm.cancel')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                );
            },
            3: () => {
                return (
                    <Fragment>
                        {/* Asks the user to confirm the staking */}
                        <div className="ModalAllowance">
                            <h1 className="StakingOptionsModal_Title">
                                {t('staking.confirmation.cardTitle')}
                            </h1>
                            <div className="tx-amount-group">
                                <div className="tx-amount-container">
                                    <div className="tx-amount-data">
                                        <div className="tx-amount">
                                            {PrecisionNumbers({
                                                amount: new BigNumber(amount),
                                                token: settings.tokens.TG,
                                                decimals: t(
                                                    'staking.display_decimals'
                                                ),
                                                t: t,
                                                i18n: i18n,
                                                ns: ns,
                                                skipContractConvert: true
                                            })}
                                        </div>
                                        <div className="tx-token">
                                            {t('staking.tokens.TG.label', {
                                                ns: ns
                                            })}
                                        </div>
                                    </div>
                                    <div className="cta-container">
                                        <div className="cta-info-group">
                                            <div className="cta-info-detail">
                                                {t(
                                                    'staking.modal.StakingOptionsModal_StakingDescription'
                                                )}
                                            </div>
                                        </div>{' '}
                                        <div className="cta-options-group">
                                            <Button
                                                type="default"
                                                onClick={onClose}
                                                className="button secondary"
                                            >
                                                {t(
                                                    'staking.modal.StakingOptionsModal_Cancel'
                                                )}
                                            </Button>
                                            <Button
                                                type="primary"
                                                onClick={addStake}
                                                className="button"
                                            >
                                                {t(
                                                    'staking.modal.StakingOptionsModal_Comfirm'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                );
            },
            99: () => {
                return (
                    <Fragment>
                        <h1 className="StakingOptionsModal_Title">
                            {t(
                                'staking.modal.StakingOptionsModal_ReviewYourWallet'
                            )}
                        </h1>
                        <div className="StakingOptionsModal_Content AllowanceLoading">
                            <Spin indicator={<LoadingOutlined />} />
                            <p>
                                {t(
                                    'staking.modal.StakingOptionsModal_ReviewYourWalletDescription'
                                )}
                            </p>
                        </div>
                    </Fragment>
                );
            }
        };

        return steps[step] ? steps[step]() : null;
    };

    const renderUnstaking = () => {
        return (
            <Fragment>
                {/* Asks the user to confirm the Unstaking */}
                <h1 className="StakingOptionsModal_Title">
                    {t('staking.modal.StakingOptionsModal_UnstakeTitle')}
                </h1>
                <div className="tx-amount-group">
                    <div className="tx-amount-container">
                        <div className="tx-amount-data">
                            {/* {t('staking.modal.StakingOptionsModal_AmountToUnstake')} */}
                            <div className="tx-amount">
                                {PrecisionNumbers({
                                    amount: new BigNumber(amount),
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: true
                                })}
                                <div className="tx-token">
                                    {t('staking.tokens.TG.abbr', {
                                        ns: ns
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cta-container">
                        <div className="cta-info-group">
                            <div className="cta-info-detail">
                                {t(
                                    'staking.modal.StakingOptionsModal_UnstakingDescription'
                                )}
                            </div>
                        </div>
                        <div className="cta-options-group">
                            <Button
                                type="secondary"
                                onClick={onClose}
                                className="button"
                            >
                                {t('staking.modal.StakingOptionsModal_Cancel')}
                            </Button>
                            <Button
                                type="primary"
                                onClick={UnStake}
                                className="button"
                            >
                                {t('staking.modal.StakingOptionsModal_Comfirm')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    };

    const renderWithdraw = () => {
        return (
            <Fragment>
                {/* Asks the user to confirm Withdraw */}
                <h1 className="StakingOptionsModal_Title">
                    {t('staking.modal.StakingOptionsModal_WithdrawTitle')}
                </h1>
                <div className="ant-modal-body">
                    <div className="tx-amount-group">
                        <div className="tx-amount-container">
                            <div className="tx-amount-data">
                                <div className="tx-amount">
                                    {PrecisionNumbers({
                                        amount: amount,
                                        token: settings.tokens.TG,
                                        decimals: t('staking.display_decimals'),
                                        t: t,
                                        i18n: i18n,
                                        ns: ns
                                    })}{' '}
                                    <div className="tx-token">
                                        {t('staking.tokens.TG.abbr', {
                                            ns: ns
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="tx-amount-info">
                                {t(
                                    'staking.modal.StakingOptionsModal_AmountToWithdraw'
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="cta-container">
                        <div className="cta-info-group">
                            <div className="cta-info-detail">
                                {t(
                                    'staking.modal.StakingOptionsModal_WithdrawDescription'
                                )}
                            </div>
                        </div>
                        <div className="cta-options-group">
                            <Button
                                type="default"
                                className="button secondary"
                                onClick={onClose}
                            >
                                {t('staking.modal.StakingOptionsModal_Cancel')}
                            </Button>
                            <Button
                                type="primary"
                                className="button"
                                onClick={withdraw}
                            >
                                {t('staking.modal.StakingOptionsModal_Comfirm')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    };

    const renderRestaking = () => {
        return (
            <Fragment>
                {/* Asks to confirm RESTAKE */}
                <h1 className="StakingOptionsModal_Title">
                    {t('staking.modal.StakingOptionsModal_RestakeTitle')}
                </h1>
                <div className="ant-modal-body">
                    <div className="tx-amount-group">
                        <div className="tx-amount-container">
                            <div className="tx-amount-data">
                                <div className="tx-amount">
                                    {PrecisionNumbers({
                                        amount: amount,
                                        token: settings.tokens.TG,
                                        decimals: t('staking.display_decimals'),
                                        t: t,
                                        i18n: i18n,
                                        ns: ns
                                    })}
                                    <div className="tx-token">
                                        {t('staking.tokens.TG.abbr', {
                                            ns: ns
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="tx-amount-info">
                                {t(
                                    'staking.modal.StakingOptionsModal_AmountToRestake'
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="cta-container">
                        <div className="cta-info-detail">
                            {t(
                                'staking.modal.StakingOptionsModal_RestakeDescription'
                            )}
                        </div>

                        <div className="cta-options-group">
                            <Button
                                type="default"
                                className="button secondary"
                                onClick={onClose}
                            >
                                {t('staking.modal.StakingOptionsModal_Cancel')}
                            </Button>
                            <Button
                                type="primary"
                                className="button"
                                onClick={CancelWithdraw}
                            >
                                {t('staking.modal.StakingOptionsModal_Comfirm')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    };

    const render = () => {
        const modes = {
            staking: renderStaking,
            unstaking: renderUnstaking,
            withdraw: renderWithdraw,
            restake: renderRestaking
        };
        return modes[mode]();
    };

    return (
        <Modal
            className="StakingOptionsModal"
            open={visible}
            onCancel={onClose}
            footer={null}
            centered={true}
            maskClosable={false}
            maskStyle={{}}
        >
            {render()}
        </Modal>
    );
}
