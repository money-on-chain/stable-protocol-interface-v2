import React, { useState, useContext, Fragment, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { Button } from 'antd';
import Web3 from 'web3';

import { AuthenticateContext } from '../../context/Auth';
import { TokenSettings, AmountToVisibleValue } from '../../helpers/currencies';
import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { tokenStake } from '../../helpers/staking';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import SelectCurrency from '../SelectCurrency';
import StakingOptionsModal from '../Modals/StakingOptionsModal/index';
import OperationStatusModal from '../Modals/OperationStatusModal/OperationStatusModal';
import InputAmount from '../InputAmount/indexInput';
import settings from '../../settings/settings.json';

const Stake = (props) => {
    const { activeTab, userInfoStaking } = props;
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const defaultTokenStake = tokenStake()[0];
    const [isUnstaking, setIsUnstaking] = useState(false);
    const [inputValidationErrorText, setInputValidationErrorText] = useState('');
    const [modalMode, setModalMode] = useState(null);
    const [modalAmount, setModalAmount] = useState('0');
    const [operationModalInfo, setOperationModalInfo] = useState({});
    const [isOperationModalVisible, setIsOperationModalVisible] = useState(false);
    const [inputValidationError, setInputValidationError] = useState(true);
    const [cleanInputCount, setUntouchCount] = useState(0);

    const [amountToStake, setAmountToStake] = useState('');
    const [amountToUnstake, setAmountToUnstake] = useState('');

    const [currentTab, setCurrentTab] = useState(activeTab);

    useEffect(() => {
        // if(amountToStake === '' && amountToUnstake === '') return;
        setIsUnstaking(activeTab === 'tab2');
        //setAmountToStake('');
        //setAmountToUnstake('');
        // console.log(activeTab);
        if (activeTab !== currentTab) {
            onClear();
            setCurrentTab(activeTab);
        }

    }, [auth, activeTab]);

    useEffect(() => {
        onValidate();
    }, [amountToStake, amountToUnstake]);

    const onValidate = () => {
        let amountInputError = false;

        const tokenSettings = TokenSettings(defaultTokenStake);
        const totalBalance = formatBigNumber(isUnstaking ? userInfoStaking['stakedBalance'] : userInfoStaking['tgBalance'], tokenSettings.decimals);
        const amountToProcess = new BigNumber(isUnstaking ? amountToUnstake : amountToStake);

        //1. Input amount valid
        if (isNaN(parseFloat(isUnstaking ? amountToUnstake : amountToStake))) {
            //setInputValidationErrorText('Invalid amount');
            amountInputError = true;
        } else if (amountToProcess.gt(totalBalance)) {
            setInputValidationErrorText('Not enough balance in your wallet');
            amountInputError = true;
        } else if (amountToProcess.lte(0)) {
            if (amountToStake !== '' || amountToUnstake !== '') {
                setInputValidationErrorText('Amount must be greater than 0');
                amountInputError = true;
            } else {
                amountInputError = true;
            }
        } else if (amountToProcess.isNaN()) {
            if (amountToStake !== '' || amountToUnstake !== '') {
                setInputValidationErrorText('Invalid amount');
                amountInputError = true;
            }
        } else if (amountToProcess.toString().length < 1) {
            setInputValidationErrorText('Amount field cannot be empty');
            amountInputError = true;
        }
        if (!amountInputError) {
            setInputValidationErrorText('');
        }
        setInputValidationError(amountInputError);
    };

    const onChangeCurrency = (newCurrency) => {
        onClear();
    };

    const onClear = () => {
        setAmountToStake('');
        setAmountToUnstake('');
    };
    const setAddTotalAvailable = () => {
        const tokenSettings = TokenSettings(defaultTokenStake);
        const total = formatBigNumber(isUnstaking ? userInfoStaking['stakedBalance'] : userInfoStaking['tgBalance'], tokenSettings.decimals);
        if (isUnstaking) setAmountToUnstake(total.toString());
        else setAmountToStake(total.toString());
    };
    const getAmount = () => {
        if (isUnstaking) {
            if (amountToUnstake === '0') {
                return 0;
            }
        } else {
            if (amountToStake === '0') {
                return 0;
            }
        }
        return AmountToVisibleValue(isUnstaking ? amountToUnstake : amountToStake, defaultTokenStake, 4, false);
    };
    const onStakeButton = () => {
        if (getAmount() > 0) {
            setModalAmount(getAmount());
            setModalMode(isUnstaking ? 'unstaking' : 'staking');
        } else {
            alert('Please fill amount you want to stake');
        }
    };

    const resetBalancesAndValues = () => {
        //setStakingBalances();
        setAmountToStake('');
        setAmountToUnstake('');
        setUntouchCount((prev) => prev + 1);
    };
    const onStakingModalConfirm = (operationStatus, txHash) => {
        const operationInfo = {
            operationStatus,
            txHash
        };

        setOperationModalInfo(operationInfo);
        setIsOperationModalVisible(true);
        resetBalancesAndValues();
    };
    const formatBigNumber = (balance, decimals) => {
        const total = new BigNumber(fromContractPrecisionDecimals(balance, decimals));
        return total;
    };

    return (
        <Fragment>
            <div className="sectionStaking__Content">
                <div className="inputFields">
                    <div className="tokenSelector">
                        <SelectCurrency
                            className="select-token"
                            value={defaultTokenStake}
                            currencyOptions={tokenStake()}
                            onChange={onChangeCurrency}
                            action={'staking'}
                            disabled={true}
                        />
                        <InputAmount
                            balanceText={t('staking.staking.inputAvailable')}
                            action={isUnstaking ? t('staking.staking.inputUnstake') : t('staking.staking.inputStake')}
                            balance={PrecisionNumbers({
                                amount: isUnstaking ? userInfoStaking['stakedBalance'] : userInfoStaking['tgBalance'],
                                token: TokenSettings(defaultTokenStake),
                                decimals: t('staking.staking.input_decimals'),
                                t: t,
                                i18n: i18n,
                                ns: ns
                            })}
                            placeholder={'0.0'}
                            inputValue={isUnstaking ? amountToUnstake : amountToStake}
                            onValueChange={isUnstaking ? setAmountToUnstake : setAmountToStake}
                            setAddTotalAvailable={setAddTotalAvailable}
                            validateError={false}
                        />
                        <div className="amountInput__feedback amountInput__feedback--error">{inputValidationErrorText}</div>
                    </div>
                </div>
            </div>

            {/* <div className="staked-text">
                {t('staking.staking.stakedAmount')}:{' '}
                {PrecisionNumbers({
                    amount: new BigNumber(stakedBalance),
                    token: settings.tokens.TG,
                    decimals: t('staking.display_decimals'),
                    t: t,
                    i18n: i18n,
                    ns: ns
                })}
                {TokenSettings(defaultTokenStake).name}
            </div> */}
            <div className="cta-container">
                <div className="cta-info-group">
                    <div className="cta-info-summary">
                        {isUnstaking ? t('staking.staking.cta.unstaking') : t('staking.staking.cta.staking')} {t('staking.staking.cta.stakingSign')}{' '}
                        {isUnstaking
                            ? amountToUnstake === ''
                                ? ''
                                : PrecisionNumbers({
                                      amount: new BigNumber(amountToUnstake),
                                      token: settings.tokens.TG,
                                      decimals: t('staking.display_decimals'),
                                      t: t,
                                      i18n: i18n,
                                      ns: ns,
                                      skipContractConvert: true
                                  })
                            : amountToStake === ''
                              ? ''
                              : PrecisionNumbers({
                                    amount: new BigNumber(amountToStake),
                                    token: settings.tokens.TG,
                                    decimals: t('staking.display_decimals'),
                                    t: t,
                                    i18n: i18n,
                                    ns: ns,
                                    skipContractConvert: true
                                })}
                        {t('staking.governanceToken')}
                    </div>
                    <div className="cta-info-detail">{t('staking.staking.cta.explanation')}</div>
                </div>
                <div className="cta-options-group">
                    <Button type="primary" className={'button'} onClick={onStakeButton} disabled={inputValidationError}>
                        {isUnstaking ? t('staking.staking.cta.unstakeButton') : t('staking.staking.cta.stakeButton')}
                    </Button>
                </div>
            </div>

            {modalMode !== null && (
                <StakingOptionsModal
                    mode={modalMode}
                    visible={modalMode !== null}
                    onClose={() => setModalMode(null)}
                    withdrawalId={null}
                    amount={modalAmount}
                    onConfirm={onStakingModalConfirm}
                />
            )}
            {isOperationModalVisible && (
                <OperationStatusModal
                    visible={isOperationModalVisible}
                    onCancel={() => setIsOperationModalVisible(false)}
                    operationStatus={operationModalInfo.operationStatus}
                    txHash={operationModalInfo.txHash}
                />
            )}
        </Fragment>
    );
};

export default Stake;
