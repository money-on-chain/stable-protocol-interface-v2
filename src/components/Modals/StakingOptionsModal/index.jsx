import { Modal, Button, Spin, notification } from 'antd';
import { useEffect, useState, useContext, Fragment } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Web3 from 'web3';

import { AuthenticateContext } from '../../../context/Auth';
import { useProjectTranslation } from '../../../helpers/translations';
import { TokenSettings } from '../../../helpers/currencies';
import { PrecisionNumbers } from '../../PrecisionNumbers';

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
        withdrawalId,
        setBlockedWithdrawals,
        currencyYouStake,
    } = props;
    const [step, setStep] = useState(0);
    const amountInEth = Web3.utils.toWei(amount, 'ether');
    // const AppProject = config.environment.AppProject;
    const AppProject = 'MoC';

    useEffect(() => {
        checkAllowance();
    }, []);

    const checkAllowance = async () => {
        if (auth.accountData && auth.userBalanceData) {
            const allowanceAmount = auth.userBalanceData.stakingmachine.tgAllowance
            if (allowanceAmount > amountInEth) setStep(2);
        }
    };

    if (!mode) return null;

    //methods
    const setAllowance = async () => {
        const onTransaction = (txHash) => { console.log("Sent transaction allowance...: ", txHash)}
        const onReceipt = () => { console.log("Transaction allowance mined!...")}
        const onError = (error) => { console.log("Transaction allowance error!...:", error)}
        setStep(1);
        await auth
            .interfaceStakingApprove(100000000, onTransaction, onReceipt, onError)
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
        const onTransaction = (txHash) => {
            console.log("Sent transaction add stake...")
            onClose();
            const status = 'pending';
            onConfirm(status, txHash);
        }
        const onReceipt = () => { console.log("Transaction add stake mined!...") }
        const onError = (error) => {
            console.log("Transaction add stake error!...:", error)
            onClose();
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
            });
    };

    const CancelWithdraw = async () => {
        onClose();
        const onTransaction = (txHash) => {
            console.log("Sent cancel withdraw allowance...: ", txHash)
            const status = 'pending';
            onConfirm(status, txHash);
            setBlockedWithdrawals((prev) => [...prev, withdrawalId]);
        }
        const onReceipt = () => { console.log("Transaction cancel withdraw mined!...")}
        const onError = (error) => { console.log("Transaction cancel withdraw error!...:", error)}
        await auth
            .interfaceStakingMachineCancelWithdraw(
                withdrawalId,
                onTransaction,
                onReceipt,
                onError
            )
            .then((res) => {
                const status = res.status ? 'success' : 'error';
                onConfirm(status, res.transactionHash);
                setBlockedWithdrawals((prev) =>
                    prev.filter((val) => val !== withdrawMoCs)
                );
                return null;
            })
            .catch((e) => {
                console.error(e);
                notification['error']({
                    message: t('global.RewardsError_Title'),
                    description: t('global.RewardsError_Message'),
                    duration: 10
                });
            });
    };

    const UnStake = async () => {
        onClose();
        const onTransaction = (txHash) => {
            console.log("Sent transaction unStake...: ", txHash);
            const status = 'pending';
            onConfirm(status, txHash);
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
            });
    };

    // const withdrawMoCs = () => {
    //     onClose();
    //     auth.interfaceDelayMachineWithdraw(withdrawalId, (error, txHash) => {
    //         if (error) return error;

    //         const status = 'pending';
    //         onConfirm(status, txHash);
    //         setBlockedWithdrawals((prev) => [...prev, withdrawalId]);
    //     })
    //         .then((res) => {
    //             const status = res.status ? 'success' : 'error';
    //             onConfirm(status, res.transactionHash);
    //             setBlockedWithdrawals((prev) =>
    //                 prev.filter((val) => val !== withdrawMoCs)
    //             );
    //             return null;
    //         })
    //         .catch((e) => {
    //             console.error(e);
    //             notification['error']({
    //                 message: t('global.RewardsError_Title'),
    //                 description: t('global.RewardsError_Message'),
    //                 duration: 10
    //             });
    //         });
    // };

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
                                        {amount}
                                    </span>
                                    <span>
                                        {t('staking.tokens.TF.label', {
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
                        {amount}
                            <span>
                                {t(`${AppProject}.Tokens_TG_code`, { ns: ns })}
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

    // const renderWithdraw = () => {
    //     return (
    //         <Fragment>
    //             <h1 className="StakingOptionsModal_Title">
    //                 {t('global.StakingOptionsModal_WithdrawTitle')}
    //             </h1>
    //             <div className="StakingOptionsModal_Content">
    //                 <div className="InfoContainer">
    //                     <span className="title">
    //                         {t('global.StakingOptionsModal_AmountToWithdraw')}
    //                     </span>
    //                     <span className="value amount">
    //                         <LargeNumber
    //                             amount={amount}
    //                             currencyCode="RESERVE"
    //                         />{' '}
    //                         <span>
    //                             {t(`${AppProject}.Tokens_TG_code`, { ns: ns })}
    //                         </span>
    //                     </span>
    //                 </div>
    //                 <p>{t('global.StakingOptionsModal_WithdrawDescription')}</p>
    //                 <div className="ActionButtonsRow">
    //                     <Button type="default" onClick={onClose}>
    //                         {t('global.StakingOptionsModal_Cancel')}
    //                     </Button>
    //                     <Button
    //                         type="primary"
    //                         onClick={withdrawMoCs}
    //                         className="ButtonPrimary"
    //                     >
    //                         {t('global.StakingOptionsModal_Comfirm')}
    //                     </Button>
    //                 </div>
    //             </div>
    //         </Fragment>
    //     );
    // };

    const renderRestaking = () => {
        return (
            <Fragment>
                <h1 className="StakingOptionsModal_Title">
                    {t('global.StakingOptionsModal_RestakeTitle')}
                </h1>
                <div className="StakingOptionsModal_Content">
                    <div className="InfoContainer">
                        <span className="title">
                            {t('global.StakingOptionsModal_AmountToRestake')}
                        </span>
                        <span className="value amount">
                            <LargeNumber
                                amount={amount}
                                currencyCode="RESERVE"
                            />{' '}
                            <span>
                                {t(`${AppProject}.Tokens_TG_code`, { ns: ns })}
                            </span>
                        </span>
                    </div>
                    <p>{t('global.StakingOptionsModal_RestakeDescription')}</p>
                    <div className="ActionButtonsRow">
                        <Button type="default" onClick={onClose}>
                            {t('global.StakingOptionsModal_Cancel')}
                        </Button>
                        <Button
                            type="primary"
                            onClick={CancelWithdraw}
                            className="ButtonPrimary"
                        >
                            {t('global.StakingOptionsModal_Comfirm')}
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
            // withdraw: renderWithdraw,
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
