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
const Stake = (props) => {
  const [t, i18n, ns] = useProjectTranslation();
  const auth = useContext(AuthenticateContext);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isDirtyYouStake, setIsDirtyYouStake] = useState(false);
  const [isDirtyYouUnstake, setIsDirtyYouUnstake] = useState(false);
  const defaultTokenStake = tokenStake()[0];
  const [mocBalance, setMocBalance] = useState('0');
  const [inputValidationErrorText, setInputValidationErrorText] = useState('');
  const [lockedBalance, setLockedBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [totalPendingExpiration, setTotalPendingExpiration] = useState('0');
  const [totalAvailableToWithdraw, setTotalAvailableToWithdraw] = useState('0');
  const [currencyYouStake, setCurrencyYouStake] = useState(defaultTokenStake);
  const [currencyYouUnstake, setCurrencyYouUnstake] = useState(defaultTokenStake);
  const [amountYouStake, setAmountYouStake] = useState(
    new BigNumber(0)
  );
  const [amountYouUnstake, setAmountYouUnstake] = useState(
    new BigNumber(0)
  );

  useEffect(() => {
    setIsUnstaking(props.activeTab === 'tab2');
    setStakingBalances();
    setAmountYouStake(new BigNumber(0));
    setAmountYouUnstake(new BigNumber(0));
  }, [auth, props.activeTab]);

  const setStakingBalances = async () => {
    try {
      let [_stakedBalance, _lockedBalance, _pendingWithdrawals] = [
        '0',
        '0',
        []
      ];
      if (props.UserBalanceData) {
        setMocBalance(props.UserBalanceData.FeeToken.balance);
        [_stakedBalance, _lockedBalance, _pendingWithdrawals] =
          await Promise.all([
            auth.interfaceStackedBalance(),
            auth.interfaceLockedBalance(),
            auth.interfacePendingWithdrawals()
          ]);
      }
      const pendingWithdrawalsFormatted = _pendingWithdrawals
        .filter((withdrawal) => withdrawal.expiration)
        .map((withdrawal) => {
          const status =
            new Date(parseInt(withdrawal.expiration) * 1000) >
              new Date()
              ? withdrawalStatus.pending
              : withdrawalStatus.available;

          return {
            ...withdrawal,
            status
          };
        });
      let pendingExpirationAmount = '0';
      let readyToWithdrawAmount = '0';
      console.log('Pending Withdrawals', pendingWithdrawalsFormatted);
      pendingWithdrawalsFormatted.forEach(({ status, amount }) => {
        if (status === withdrawalStatus.pending) {
          pendingExpirationAmount = BigNumber.sum(
            pendingExpirationAmount,
            amount
          ).toFixed(0);
        } else {
          readyToWithdrawAmount = BigNumber.sum(
            readyToWithdrawAmount,
            amount
          ).toFixed(0);
        }
      });
      const arrayDes = pendingWithdrawalsFormatted.sort(function (a, b) {
        return b.id - a.id;
      });
      setLockedBalance(_lockedBalance);
      console.log('Staked balance', _stakedBalance);
      setStakedBalance(_stakedBalance);
      setTotalPendingExpiration(pendingExpirationAmount);
      setTotalAvailableToWithdraw(readyToWithdrawAmount);
      setPendingWithdrawals(arrayDes);
      console.log('Staking balances', _stakedBalance, _lockedBalance, _pendingWithdrawals);
    } catch (error) {
      console.log('Error getting staking balances', error);
    }
  };

  const clickButtonStake = (amountInputValue) => {
    if (amountInputValue > 0) {
      setModalAmount(amountInputValue);
      setModalMode('staking');
    } else {
      alert('Please fill amount you want to stake');
    }
  };
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
    if (newAmount === '' ) {
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
              amount: isUnstaking? stakedBalance : mocBalance,
              token: TokenSettings(isUnstaking ? currencyYouUnstake : currencyYouStake),
              decimals:
                TokenSettings(isUnstaking ? currencyYouUnstake: currencyYouStake )
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
            onClick={() => { }}
          >
            {isUnstaking ? "Unstake" : "Stake"}
          </Button>
        </div>
        <div className="right-column">
          <div className="note-text">{t('staking.staking.note')}</div>
        </div>
      </div>
    </Fragment>
  )
}

export default Stake
