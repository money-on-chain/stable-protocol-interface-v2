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
        try {
            const allowanceAmount = await auth.interfaceGetMoCAllowance();
            if (allowanceAmount > amountInEth) setStep(2);
        } catch (error) {
            console.log('error reading allowance is ', error);            
        }
    };

    if (!mode) return null;

    //methods
    const setAllowance = async () => {
        setStep(1);
        await auth
            .interfaceApproveMoCTokenStaking(true, (error) => { })
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

    const depositMoCs = async () => {
        setStep(99);
        await auth
            .interfaceStakingDeposit(
                amount,
                accountData.Wallet,
                (error, txHash) => {
                    onClose();
                    if (error) {
                        return error;
                    }
                    const status = 'pending';
                    onConfirm(status, txHash);
                }
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

    // const restakeMoCs = async () => {
    //     onClose();
    //     await auth
    //         .interfaceDelayMachineCancelWithdraw(
    //             withdrawalId,
    //             (error, txHash) => {
    //                 if (error) return error;

    //                 const status = 'pending';
    //                 onConfirm(status, txHash);
    //                 setBlockedWithdrawals((prev) => [...prev, withdrawalId]);
    //             }
    //         )
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

    const unstakeMoCs = async () => {
        onClose();
        await auth
            .interfaceUnStake(amount, (error, txHash) => {
                if (error) return error;
 
                const status = 'pending';
                onConfirm(status, txHash);
            })
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
                                    onClick={depositMoCs}
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
                            onClick={unstakeMoCs}
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

    // const renderRestaking = () => {
    //     return (
    //         <Fragment>
    //             <h1 className="StakingOptionsModal_Title">
    //                 {t('global.StakingOptionsModal_RestakeTitle')}
    //             </h1>
    //             <div className="StakingOptionsModal_Content">
    //                 <div className="InfoContainer">
    //                     <span className="title">
    //                         {t('global.StakingOptionsModal_AmountToRestake')}
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
    //                 <p>{t('global.StakingOptionsModal_RestakeDescription')}</p>
    //                 <div className="ActionButtonsRow">
    //                     <Button type="default" onClick={onClose}>
    //                         {t('global.StakingOptionsModal_Cancel')}
    //                     </Button>
    //                     <Button
    //                         type="primary"
    //                         onClick={restakeMoCs}
    //                         className="ButtonPrimary"
    //                     >
    //                         {t('global.StakingOptionsModal_Comfirm')}
    //                     </Button>
    //                 </div>
    //             </div>
    //         </Fragment>
    //     );
    // };

    const render = () => {
        const modes = {
            staking: renderStaking,
            unstaking: renderUnstaking,
            // withdraw: renderWithdraw,
            // restake: renderRestaking
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
