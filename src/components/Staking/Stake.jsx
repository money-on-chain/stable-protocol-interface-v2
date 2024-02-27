import React, { useState, useContext, Fragment, useEffect } from 'react'
import BigNumber from 'bignumber.js';
import { Button } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import { TokenSettings, TokenBalance, AmountToVisibleValue } from '../../helpers/currencies';
import { useProjectTranslation } from '../../helpers/translations';
import { tokenExchange } from '../../helpers/exchange';
import { PrecisionNumbers } from '../PrecisionNumbers';
import InputAmount from '../InputAmount';
import SelectCurrency from '../SelectCurrency';
import { tokenStake } from '../../helpers/staking';
import { fromContractPrecisionDecimals } from '../../helpers/Formats';
import StakingOptionsModal from '../Modals/StakingOptionsModal/index';

const Stake = (props) => {
  const {
    activeTab,
    mocBalance,
    stakedBalance,
    setStakingBalances,
  } = props;
  const [t, i18n, ns] = useProjectTranslation();
  const auth = useContext(AuthenticateContext);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isDirtyYouStake, setIsDirtyYouStake] = useState(false);
  const [isDirtyYouUnstake, setIsDirtyYouUnstake] = useState(false);
  const defaultTokenStake = tokenStake()[0];
  const [inputValidationErrorText, setInputValidationErrorText] = useState('');
  const [currencyYouStake, setCurrencyYouStake] = useState(defaultTokenStake);
  const [currencyYouUnstake, setCurrencyYouUnstake] = useState(defaultTokenStake);
  const [modalMode, setModalMode] = useState(null);
  const [withdrawalId, setWithdrawalId] = useState('0');
  const [modalAmount, setModalAmount] = useState('0');
  const [blockedWithdrawals, setBlockedWithdrawals] = useState([]);
  const [operationModalInfo, setOperationModalInfo] = useState({});
  const [isOperationModalVisible, setIsOperationModalVisible] = useState(false);
  const [cleanInputCount, setUntouchCount] = useState(0);
  const [amountYouStake, setAmountYouStake] = useState(
    new BigNumber(0)
  );
  const [amountYouUnstake, setAmountYouUnstake] = useState(
    new BigNumber(0)
  );
  useEffect(() => {
    setIsUnstaking(activeTab === 'tab2');
    setAmountYouStake(new BigNumber(0));
    setAmountYouUnstake(new BigNumber(0));
  }, [auth, activeTab]);

  const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
    onClear();
    setCurrencyYouStake(newCurrencyYouExchange);
  };
  const onClear = () => {
    setIsDirtyYouStake(false);
    setAmountYouStake(new BigNumber(0));
  };
  const onChangeAmountYouStake = (newAmount) => {
    setIsDirtyYouStake(true);
    if (newAmount === '') {
      setAmountYouStake(new BigNumber(0));
      return;
    }
    setAmountYouStake(new BigNumber(newAmount));
  };
  const onChangeAmountYouUnstake = (newAmount) => {
    setIsDirtyYouUnstake(true);
    if (newAmount === '') {
      setAmountYouUnstake(new BigNumber(0));
      return;
    }
    setAmountYouUnstake(new BigNumber(newAmount));
  };
  const setAddTotalAvailable = () => {
    setIsDirtyYouStake(false);
    const tokenSettings = TokenSettings(currencyYouStake);
    const totalYouStake = new BigNumber(
      fromContractPrecisionDecimals(
        TokenBalance(auth, currencyYouStake),
        tokenSettings.decimals
      )
    );
    setAmountYouStake(totalYouStake);
  };
  const getAmount = () => {
    if (isUnstaking) {
      if (amountYouUnstake.toString() === '0') {
        return 0;
      }
    } else {
      if (amountYouStake.toString() === '0') {
        return 0;
      }
    }
    return AmountToVisibleValue(
      isUnstaking ? amountYouUnstake : amountYouStake,
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
    setAmountYouUnstake(new BigNumber(0));
    setAmountYouStake(new BigNumber(0));

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

  return (
    <Fragment>
      <div className="swap-from">
        <SelectCurrency
          className="select-token"
          value={isUnstaking ? currencyYouUnstake : currencyYouStake}
          currencyOptions={tokenStake()}
          onChange={onChangeCurrencyYouExchange}
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
      <div className='staked-text'>{`${t('staking.staking.staked')}: ${stakedBalance} ${TokenSettings(currencyYouStake).name}`}</div>
      <div className="action-section">
        <div className="left-column">
          <div className="title">
            {isUnstaking ? `Unstaking = ${amountYouUnstake} MOC` : `Staking = ${amountYouStake} MOC`}
          </div>
          <Button
            type="primary"
            className={"primary-button btn-confirm"}
            onClick={onStakeButton}
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
