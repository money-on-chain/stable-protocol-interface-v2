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
import InputAmount from '../InputAmount';
import SelectCurrency from '../SelectCurrency';
import StakingOptionsModal from '../Modals/StakingOptionsModal/index';
import OperationStatusModal from '../Modals/OperationStatusModal/OperationStatusModal';
import { getUSD } from '../../helpers/balances';

const Stake = (props) => {
  const {
    activeTab,
    mocBalance,
    stakedBalance,
    setStakingBalances,
  } = props;
  const [t, i18n, ns] = useProjectTranslation();
  const auth = useContext(AuthenticateContext);
  const defaultTokenStake = tokenStake()[0];
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isDirtyYouStake, setIsDirtyYouStake] = useState(false);
  const [isDirtyYouUnstake, setIsDirtyYouUnstake] = useState(false);
  const [inputValidationErrorText, setInputValidationErrorText] = useState('');
  const [currencyYouStake, setCurrencyYouStake] = useState(defaultTokenStake);
  const [currencyYouUnstake, setCurrencyYouUnstake] = useState(defaultTokenStake);
  const [modalMode, setModalMode] = useState(null);
  const [withdrawalId, setWithdrawalId] = useState('0');
  const [modalAmount, setModalAmount] = useState('0');
  const [blockedWithdrawals, setBlockedWithdrawals] = useState([]);
  const [operationModalInfo, setOperationModalInfo] = useState({});
  const [isOperationModalVisible, setIsOperationModalVisible] = useState(false);
  const [inputValidationError, setInputValidationError] = useState(true);
  const [cleanInputCount, setUntouchCount] = useState(0);
  const [amountStake, setAmountStake] = useState(
    new BigNumber(0)
  );
  const [amountUnstake, setAmountUnstake] = useState(
    new BigNumber(0)
  );
  const [inputValidation, setInputValidation] = useState({
    validateStatus: 'success'
  });

  useEffect(() => {
    setIsUnstaking(activeTab === 'tab2');
    setAmountStake(new BigNumber(0));
    setAmountUnstake(new BigNumber(0));
  }, [auth, activeTab]);

  useEffect(() => {
    onValidate();
  }, [amountStake, amountUnstake])
  const onValidate = () => {
    console.log('onValidate staking/unstaking amount');
    let amountInputError = false

    const tokenSettings = TokenSettings(isUnstaking ? currencyYouUnstake : currencyYouStake);
    const totalBalance = formatBigNumber(isUnstaking ? stakedBalance : mocBalance, tokenSettings.decimals);
    console.log('totalBalance', totalBalance);
    const amountToProcess = isUnstaking ? amountUnstake : amountStake;
    console.log('amountToCompare', amountToProcess);
    console.log('is greater',amountToProcess.gt(totalBalance));
    //1. Input amount valid
    if (amountToProcess.gt(totalBalance)) {
      setInputValidationErrorText('Not enough balance in your wallet');
      amountInputError = true
    }
    else if (amountToProcess.lte(0)) {
      setInputValidationErrorText('Amount must be greater than 0');
      amountInputError = true
    }
    else if (amountToProcess.isNaN()) {
      setInputValidationErrorText('Invalid amount');
      amountInputError = true
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
    setIsDirtyYouStake(false);
    setAmountStake(new BigNumber(0));
  };
  const onChangeAmountYouStake = (newAmount) => {
    setIsDirtyYouStake(true);
    if (newAmount === '' || newAmount === null) {
      setAmountStake(new BigNumber(0));
      return;
    }
    setAmountStake(new BigNumber(newAmount));
  };
  const onChangeAmountYouUnstake = (newAmount) => {
    setIsDirtyYouUnstake(true);
    if (newAmount === '') {
      setAmountUnstake(new BigNumber(0));
      return;
    }
    setAmountUnstake(new BigNumber(newAmount));
  };
  const setAddTotalAvailable = () => {
    setIsDirtyYouStake(false);
    const tokenSettings = TokenSettings(isUnstaking ? currencyYouUnstake : currencyYouStake);
    const total = formatBigNumber(isUnstaking ? stakedBalance : mocBalance, tokenSettings.decimals);
    if (isUnstaking) setAmountUnstake(total);
    else setAmountStake(total);
  };
  const getAmount = () => {
    if (isUnstaking) {
      if (amountUnstake.toString() === '0') {
        return 0;
      }
    } else {
      if (amountStake.toString() === '0') {
        return 0;
      }
    }
    return AmountToVisibleValue(
      isUnstaking ? amountUnstake : amountStake,
      isUnstaking ? currencyYouUnstake : currencyYouStake,
      4,
      false
    )
  }
  const onStakeButton = () => {
    if (getAmount() > 0) {
      setModalAmount(getAmount());
      setModalMode('staking');
    } else {
      alert('Please fill amount you want to stake');
    }
  }

  const resetBalancesAndValues = () => {
    setStakingBalances();
    setAmountUnstake(new BigNumber(0));
    setAmountStake(new BigNumber(0));

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
          InputValue={getAmount()}
          placeholder={'0.0'}
          onValueChange={isUnstaking ? onChangeAmountYouUnstake : onChangeAmountYouStake}
          validateError={false}
          isDirty={isUnstaking ? isDirtyYouUnstake : isDirtyYouStake}
          balance={
            PrecisionNumbers({
              amount: isUnstaking ? stakedBalance : mocBalance,
              token: TokenSettings(isUnstaking ? currencyYouUnstake : currencyYouStake),
              decimals:
                TokenSettings(isUnstaking ? currencyYouUnstake : currencyYouStake)
                  .visibleDecimals,
              t: t,
              i18n: i18n,
              ns: ns
            })
          }
          setAddTotalAvailable={setAddTotalAvailable}
          action={isUnstaking ? 'To UnStake' : 'To Stake'}
        />
        <div className="input-validation-error">{inputValidationErrorText}</div>
      </div>
      <div className='staked-text'>
        {`${t('staking.staking.staked')}: ${parseFloat(Web3.utils.fromWei(stakedBalance, 'ether')).toFixed(4)} ${TokenSettings(currencyYouStake).name}`}
      </div>
      <div className="action-section">
        <div className="left-column">
          <div className="title">
            {isUnstaking ? `Unstaking = ${amountUnstake.toFixed(4)} MOC` : `Staking = ${(amountStake).toFixed(4)} MOC`}
          </div>
          <Button
            type="primary"
            className={"primary-button btn-confirm"}
            onClick={onStakeButton}
            disabled={inputValidationError}
          >
            {isUnstaking ? "Unstake" : "Stake"}
          </Button>
        </div>
        <div className="right-column">
          <div className="note-text">{t('staking.staking.note')}</div>
        </div>
      </div>
      {modalMode !== null && <StakingOptionsModal
        mode={modalMode}
        visible={modalMode !== null}
        onClose={() => setModalMode(null)}
        withdrawalId={withdrawalId}
        amount={modalAmount}
        onConfirm={onStakingModalConfirm}
        setBlockedWithdrawals={setBlockedWithdrawals}
        currencyYouStake={currencyYouStake}
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
