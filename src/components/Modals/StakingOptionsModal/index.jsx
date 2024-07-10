import { Modal, Button, Spin, notification, Checkbox } from 'antd';
import React, { useEffect, useState, useContext, Fragment } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Web3 from 'web3';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import { TokenSettings } from '../../../helpers/currencies';
import { PrecisionNumbers } from '../../PrecisionNumbers';
import BigNumber from 'bignumber.js';
import settings from '../../../settings/settings.json';

export default function StakingOptionsModal(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n, ns] = useProjectTranslation();
    const { accountData = {} } = auth;
    const {
        mode,
        onClose,
        visible,
        amount,
        onConfirm,
        withdrawalId
    } = props;

    const [step, setStep] = useState(0);
    const amountInEth = Web3.utils.toWei(amount, 'ether');
    let infinityAllowance = false;

    useEffect(() => {
        checkAllowance();
    }, []);


    const onChangeInfinity = (e) => {
        console.log(`checked = ${e.target.checked}`);
        infinityAllowance = e.target.checked
    };

    const checkAllowance = async () => {
        if (auth.accountData && auth.userBalanceData) {
            const allowanceAmount = auth.userBalanceData.stakingmachine.tgAllowance
            if (allowanceAmount > amountInEth) setStep(2);
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

        const onTransaction = (txHash) => { console.log("Sent transaction allowance...: ", txHash)}
        const onReceipt = () => { console.log("Transaction allowance mined!...")}
        const onError = (error) => { console.log("Transaction allowance error!...:", error)}

        await auth
            .interfaceStakingApprove(amountAllowance, onTransaction, onReceipt, onError)
            .then((res) => {
                setStep(2);
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
            console.log("Sent transaction add stake...")
            onConfirm('pending', txHash);
        }
        const onReceipt = () => { console.log("Transaction add stake mined!...") }
        const onError = (error) => {
            console.log("Transaction add stake error!...:", error)
        }
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
            console.log("Sent cancel withdraw ...: ", txHash)
            onConfirm('pending', txHash);
        }
        const onReceipt = () => { console.log("Transaction cancel withdraw mined!...")}
        const onError = (error) => { console.log("Transaction cancel withdraw error!...:", error)}
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
            console.log("Sent transaction unStake...: ", txHash);
            onConfirm('pending', txHash);
        }
        const onReceipt = () => { console.log("Transaction unStake mined!...")}
        const onError = (error) => { console.log("Transaction unStake error!...:", error)}
        await auth
            .interfaceStakingUnStake(
                amount,
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
            console.log("Sent withdraw...: ", txHash)
            onConfirm('pending', txHash);
        }
        const onReceipt = () => { console.log("Transaction withdraw mined!...")}
        const onError = (error) => { console.log("Transaction withdraw error!...:", error)}
        auth.interfaceStakingDelayMachineWithdraw(
            withdrawalId,
            onTransaction,
            onReceipt,
            onError)
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
                        <h1 className="StakingOptionsModal_Title">
                            {t('staking.modal.StakingOptionsModal_SetAllowance')}
                        </h1>
                        <div className="StakingOptionsModal_Content">
                            <p>
                                {t('staking.modal.StakingOptionsModal_AllowanceDescription')}
                            </p>
                            <div className="remember-this">
                                <Checkbox
                                    className="check-unlimited"
                                    onChange={onChangeInfinity}
                                >{t('allowance.setUnlimited')}
                                </Checkbox>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <Button type="primary" className="primary-button btn-confirm" onClick={setAllowance}>
                                    {t('staking.modal.StakingOptionsModal_Authorize')}
                                </Button>
                            </div>
                        </div>
                    </Fragment>
                );
            },
            1: () => {
                return (
                    <Fragment>
                        <h1 className="StakingOptionsModal_Title">
                            {t('staking.modal.StakingOptionsModal_SetAllowance')}
                        </h1>
                        <div className="StakingOptionsModal_Content AllowanceLoading">
                            <Spin indicator={<LoadingOutlined />} />
                            <p>
                                {t('staking.modal.StakingOptionsModal_ProccessingAllowance')}
                            </p>
                        </div>
                    </Fragment>
                );
            },
            2: () => {
                return (
                    <Fragment>
                        <h1 className="StakingOptionsModal_Title">
                            {t('staking.modal.StakingOptionsModal_Title')}
                        </h1>
                        <div className="StakingOptionsModal_Content">
                            <div className="InfoContainer">
                                <span className="title">
                                    {t('staking.modal.StakingOptionsModal_AmountToStake')}
                                </span>
                                <span className="value amount">
                                    <span className="value">

                                        {PrecisionNumbers({
                                            amount: new BigNumber(amount),
                                            token: settings.tokens.TG,
                                            decimals: t('staking.display_decimals'),
                                            t: t,
                                            i18n: i18n,
                                            ns: ns,
                                            skipContractConvert: true
                                        })}

                                    </span>
                                    <span>
                                        {t('staking.tokens.TG.label', {
                                            ns: ns
                                        })}
                                    </span>
                                </span>
                            </div>
                            <p>
                                {t('staking.modal.StakingOptionsModal_StakingDescription')}
                            </p>
                            <div className="ActionButtonsRow">
                                <Button type="default" onClick={onClose} className="secondary-button btn-clear" >
                                    {t('staking.modal.StakingOptionsModal_Cancel')}
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={addStake}
                                    className="primary-button btn-confirm"
                                >
                                    {t('staking.modal.StakingOptionsModal_Comfirm')}
                                </Button>
                            </div>
                        </div>
                    </Fragment>
                );
            },
            99: () => {
                return (
                    <Fragment>
                        <h1 className="StakingOptionsModal_Title">
                            {t('staking.modal.StakingOptionsModal_ReviewYourWallet')}
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
                <h1 className="StakingOptionsModal_Title">
                    {t('staking.modal.StakingOptionsModal_UnstakeTitle')}
                </h1>
                <div className="StakingOptionsModal_Content">
                    <div className="InfoContainer">
                        <span className="title">
                            {t('staking.modal.StakingOptionsModal_AmountToUnstake')}
                        </span>
                        <span className="value amount">

                            {PrecisionNumbers({
                                amount: new BigNumber(amount),
                                token: settings.tokens.TG,
                                decimals: t('staking.display_decimals'),
                                t: t,
                                i18n: i18n,
                                ns: ns,
                                skipContractConvert: true
                            })}

                            <span>
                                {t('staking.tokens.TG.abbr', {
                                    ns: ns
                                })}
                            </span>
                        </span>
                    </div>
                    <p>
                        {t('staking.modal.StakingOptionsModal_UnstakingDescription')}
                    </p>
                    <div className="ActionButtonsRow">
                        <Button type="default" onClick={onClose}>
                            {t('staking.modal.StakingOptionsModal_Cancel')}
                        </Button>
                        <Button
                            type="primary"
                            onClick={UnStake}
                            className="ButtonPrimary"
                        >
                            {t('staking.modal.StakingOptionsModal_Comfirm')}
                        </Button>
                    </div>
                </div>
            </Fragment>
        );
    };

    const renderWithdraw = () => {
        return (
            <Fragment>
                <h1 className="StakingOptionsModal_Title">
                    {t('staking.modal.StakingOptionsModal_WithdrawTitle')}
                </h1>
                <div className="StakingOptionsModal_Content">
                    <div className="InfoContainer">
                        <span className="title">
                            {t('staking.modal.StakingOptionsModal_AmountToWithdraw')}
                        </span>
                        <span className="value amount">
                            {PrecisionNumbers({
                                amount: amount,
                                token: settings.tokens.TG,
                                decimals: t('staking.display_decimals'),
                                t: t,
                                i18n: i18n,
                                ns: ns
                            })}{' '}
                            <span>
                                 {t('staking.tokens.TG.abbr', {
                                     ns: ns
                                 })}
                            </span>
                        </span>
                    </div>
                    <p>{t('staking.modal.StakingOptionsModal_WithdrawDescription')}</p>
                    <div className="ActionButtonsRow">
                        <Button type="default" onClick={onClose}>
                            {t('staking.modal.StakingOptionsModal_Cancel')}
                        </Button>
                        <Button
                            type="primary"
                            onClick={withdraw}
                            className="ButtonPrimary"
                        >
                            {t('staking.modal.StakingOptionsModal_Comfirm')}
                        </Button>
                    </div>
                </div>
            </Fragment>
        );
    };

    const renderRestaking = () => {
        return (
            <Fragment>
                <h1 className="StakingOptionsModal_Title">
                    {t('staking.modal.StakingOptionsModal_RestakeTitle')}
                </h1>
                <div className="StakingOptionsModal_Content">
                    <div className="InfoContainer">
                        <span className="title">
                            {t('staking.modal.StakingOptionsModal_AmountToRestake')}
                        </span>
                        <span className="value amount">
                            {PrecisionNumbers({
                                amount: amount,
                                token: settings.tokens.TG,
                                decimals: t('staking.display_decimals'),
                                t: t,
                                i18n: i18n,
                                ns: ns
                            })}
                            <span>
                                {t('staking.tokens.TG.abbr', {
                                    ns: ns
                                })}
                            </span>
                        </span>
                    </div>
                    <p>{t('staking.modal.StakingOptionsModal_RestakeDescription')}</p>
                    <div className="ActionButtonsRow">
                        <Button type="default" onClick={onClose}>
                            {t('staking.modal.StakingOptionsModal_Cancel')}
                        </Button>
                        <Button
                            type="primary"
                            onClick={CancelWithdraw}
                            className="ButtonPrimary"
                        >
                            {t('staking.modal.StakingOptionsModal_Comfirm')}
                        </Button>
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
            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', backdropFilter: 'blur(2px)' }}
        >
            {render()}
        </Modal>
    );
}
