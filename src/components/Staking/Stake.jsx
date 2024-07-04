import React, { useState, useContext, Fragment, useEffect } from 'react'
import BigNumber from 'bignumber.js';
import { Button } from 'antd';
import Web3 from 'web3';

import { AuthenticateContext } from '../../context/Auth';
import { TokenSettings, TokenBalance, AmountToVisibleValue } from '../../helpers/currencies';
import { useProjectTranslation } from '../../helpers/translations';
import { PrecisionNumbers } from '../PrecisionNumbers';
import { tokenStake } from '../../helpers/staking';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import SelectCurrency from '../SelectCurrency';
import StakingOptionsModal from '../Modals/StakingOptionsModal/index';
import OperationStatusModal from '../Modals/OperationStatusModal/OperationStatusModal';
import InputAmount from '../InputAmount/indexInput';

const Stake = (props) => {
  const {
    activeTab,
    tgBalance,
    stakedBalance,
    lockedBalance,
    setStakingBalances,
  } = props;
  const [t, i18n, ns] = useProjectTranslation();
  const auth = useContext(AuthenticateContext);
  const defaultTokenStake = tokenStake()[0];
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [inputValidationErrorText, setInputValidationErrorText] = useState('');
  const [currencyYouStake, setCurrencyYouStake] = useState(defaultTokenStake);
  const [currencyYouUnstake, setCurrencyYouUnstake] = useState(defaultTokenStake);
  const [modalMode, setModalMode] = useState(null);
  const [modalAmount, setModalAmount] = useState('0');
  const [blockedWithdrawals, setBlockedWithdrawals] = useState([]);
  const [operationModalInfo, setOperationModalInfo] = useState({});
  const [isOperationModalVisible, setIsOperationModalVisible] = useState(false);
  const [inputValidationError, setInputValidationError] = useState(true);
  const [cleanInputCount, setUntouchCount] = useState(0);

  const [amountToStake, setAmountToStake] = useState('');
  const [amountToUnstake, setAmountToUnstake] = useState('');

  useEffect(() => {
    // if(amountToStake === '' && amountToUnstake === '') return;
    setIsUnstaking(activeTab === 'tab2');
    setAmountToStake('0.0');
    setAmountToUnstake('0.0');
    // console.log(activeTab);
  }, [auth, activeTab]);

  useEffect(() => {
    onValidate();
  }, [amountToStake, amountToUnstake])
  const onValidate = () => {
    let amountInputError = false

    const tokenSettings = TokenSettings(isUnstaking ? currencyYouUnstake : currencyYouStake);
    const totalBalance = formatBigNumber(isUnstaking ? stakedBalance : tgBalance, tokenSettings.decimals);
    const amountToProcess =  formatBigNumber(isUnstaking ? amountToUnstake : amountToStake, tokenSettings.decimals);
    //1. Input amount valid
    if (isUnstaking && isNaN(parseFloat(amountToUnstake))){
      setInputValidationErrorText('Invalid amount');
      amountInputError = true
    }
    else if (amountToProcess.gt(totalBalance)) {
      setInputValidationErrorText('Not enough balance in your wallet');
      amountInputError = true
    }
    else if (amountToProcess.lte(0)) {
      if (amountToStake !== '0.0' || amountToUnstake !== '0.0') {
        setInputValidationErrorText('Amount must be greater than 0');
        amountInputError = true
      } else {
        amountInputError = true
      }
    }
    else if (amountToProcess.isNaN()) {
      if (amountToStake !== '' || amountToUnstake !== '') {
        setInputValidationErrorText('Invalid amount');
        amountInputError = true
      }
    }
    else if (amountToProcess.toString().length < 1) {
      setInputValidationErrorText('Amount field cannot be empty');
      amountInputError = true
    }
    if (!amountInputError) {
      setInputValidationErrorText('');
    }
    setInputValidationError(amountInputError);
  };

  const onChangeCurrency = (newCurrency) => {
    onClear();
    setCurrencyYouStake(newCurrency);
  };
  const onClear = () => {
    setAmountToStake('0.0');
    setAmountToUnstake('0.0');
  };
  const setAddTotalAvailable = () => {
    const tokenSettings = TokenSettings(isUnstaking ? currencyYouUnstake : currencyYouStake);
    const total = formatBigNumber(isUnstaking ? stakedBalance : tgBalance, tokenSettings.decimals);
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
    return AmountToVisibleValue(
      isUnstaking ? amountToUnstake : amountToStake,
      isUnstaking ? currencyYouUnstake : currencyYouStake,
      4,
      false
    )
  }
  const formatNumber = (number) => {
    if (isNaN(parseFloat(number).toFixed(3))) {
      return '0.0';
    }
    return parseFloat(number).toFixed(4);
  }
  const onStakeButton = () => {
    if (getAmount() > 0) {
      setModalAmount(getAmount());
      setModalMode(isUnstaking ? 'unstaking' : 'staking');
    } else {
      alert('Please fill amount you want to stake');
    }
  }

  const resetBalancesAndValues = () => {
    setStakingBalances();
    setAmountToStake('0.0');
    setAmountToUnstake('0.0');
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
    const total = new BigNumber(
      fromContractPrecisionDecimals(
        balance,
        decimals
      )
    );
    return total;
  }
  return (
    <Fragment>
      <div className="swap-from">
        <SelectCurrency
          className="select-token"
          value={isUnstaking ? currencyYouUnstake : currencyYouStake}
          currencyOptions={tokenStake()}
          onChange={onChangeCurrency}
          action={'staking'}
          disabled={true}
        />
        <InputAmount
          balanceText={t('staking.staking.inputAvailable')}
          action={isUnstaking ? t('staking.staking.inputUnstake') : t('staking.staking.inputStake')}
          balance={
            PrecisionNumbers({
              amount: isUnstaking ? stakedBalance : tgBalance,
              token: TokenSettings(isUnstaking ? currencyYouUnstake : currencyYouStake),
              decimals:
                TokenSettings(isUnstaking ? currencyYouUnstake : currencyYouStake)
                  .visibleDecimals,
              t: t,
              i18n: i18n,
              ns: ns
            })
          }
          placeholder={'0.0'}
          inputValue={isUnstaking ? amountToUnstake : amountToStake}
          onValueChange={isUnstaking ? setAmountToUnstake : setAmountToStake}
          setAddTotalAvailable={setAddTotalAvailable}
          validateError={false}
        />
        <div className="input-validation-error">{inputValidationErrorText}</div>
      </div>
      <div className='staked-text'>
        {`${t('staking.staking.stakedAmount')}: ${parseFloat(Web3.utils.fromWei(stakedBalance, 'ether')).toFixed(4)} ${TokenSettings(currencyYouStake).name}`}
      </div>
      <div className="cta">
          <div className="note-text">{t('staking.staking.cta.explanation')}</div>
          <div className="summary">
            {isUnstaking ? `${t('staking.staking.cta.staking')} ${t('staking.staking.cta.stakingSign')} ${formatNumber(amountToUnstake)} ${t('staking.governanceToken')}` : `${t('staking.staking.cta.staking')} ${t('staking.staking.cta.stakingSign')} ${formatNumber(amountToStake)} ${t('staking.governanceToken')}`}
          </div>
          <Button
            type="primary"
            className={"primary-button btn-confirm"}
            onClick={onStakeButton}
            disabled={inputValidationError}>
            {isUnstaking ? t('staking.staking.cta.unstakeButton') : t('staking.staking.cta.stakeButton')}
          </Button>
      </div>
      {modalMode !== null && <StakingOptionsModal
        mode={modalMode}
        visible={modalMode !== null}
        onClose={() => setModalMode(null)}
        withdrawalId={null}
        amount={modalAmount}
        onConfirm={onStakingModalConfirm}
        setBlockedWithdrawals={setBlockedWithdrawals}
      />}
      {isOperationModalVisible && <OperationStatusModal
        visible={isOperationModalVisible}
        onCancel={() => setIsOperationModalVisible(false)}
        operationStatus={operationModalInfo.operationStatus}
        txHash={operationModalInfo.txHash}
      />}
    </Fragment>
  )
}

export default Stake
