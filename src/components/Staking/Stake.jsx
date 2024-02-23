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
import {tokenStake} from '../../helpers/staking';
import {fromContractPrecisionDecimals} from '../../helpers/Formats';
const Stake = (props) => {
  const [t, i18n, ns] = useProjectTranslation();
  const auth = useContext(AuthenticateContext);
  const defaultTokenExchange = tokenStake()[0];
  const [mocBalance, setMocBalance] = useState('0');
  const [isDirtyYouExchange, setIsDirtyYouStake] = useState(false);
  const [inputValidationErrorText, setInputValidationErrorText] = useState('');
  const [lockedBalance, setLockedBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [totalPendingExpiration, setTotalPendingExpiration] = useState('0');
  const [totalAvailableToWithdraw, setTotalAvailableToWithdraw] = useState('0');
  const [currencyYouStake, setCurrencyYouExchange] = useState(defaultTokenExchange);
  const [amountYouStake, setAmountYouStake] = useState(
    new BigNumber(0)
  );

  useEffect(() => {
    setStakingBalances();
  }, [auth]);

  const setStakingBalances = async () => {
    try {
      let [_stakedBalance, _lockedBalance, _pendingWithdrawals] = [
        '0',
        '0',
        []
      ];
      if (props.UserBalanceData) {
        setMocBalance(props.UserBalanceData.TP[0].balance);
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
      console.log('Staked balance', _stakedBalance );
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
    setCurrencyYouExchange(newCurrencyYouExchange);
  };
  const onClear = () => {
    setIsDirtyYouStake(false);
    setAmountYouStake(new BigNumber(0));
  };
  const onChangeAmountYouStake = (newAmount) => {
    setIsDirtyYouStake(true);
    setAmountYouStake(new BigNumber(newAmount));
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
  console.log('precision', PrecisionNumbers({
    amount: stakedBalance,
    token: TokenSettings(currencyYouStake),
    decimals:
      TokenSettings(currencyYouStake)
        .visibleDecimals,
    t: t,
    i18n: i18n,
    ns: ns
  }));
  return (
    <Fragment>
      <div className="swap-from">
        <SelectCurrency
          className="select-token"
          value={currencyYouStake}
          currencyOptions={tokenStake()}
          onChange={onChangeCurrencyYouExchange}
          action={'staking'}
        />

        <InputAmount
          InputValue={amountYouStake.toString() === '0' ? 0 : AmountToVisibleValue(
            amountYouStake,
            currencyYouStake,
            3,
            false
          )}
          placeholder={'0.0'}
          onValueChange={onChangeAmountYouStake}
          validateError={false}
          isDirty={isDirtyYouExchange}
          balance={
            PrecisionNumbers({
              amount: mocBalance,
              token: TokenSettings(currencyYouStake),
              decimals:
                TokenSettings(currencyYouStake)
                  .visibleDecimals,
              t: t,
              i18n: i18n,
              ns: ns
            })
          }
          setAddTotalAvailable={setAddTotalAvailable}
          action={'STAKING'}
        />
        <div className="input-validation-error">{inputValidationErrorText}</div>
      </div>
      <div className='staked-text'>{`${t('staking.staking.staked')}: ${stakedBalance} ${TokenSettings(currencyYouStake).name}`}</div>
      <div className="action-section">
        <div className="left-column">
          <div className="title">{`Staking = ${amountYouStake} MOC`}</div>
          <Button
            type="primary"
            className={"primary-button btn-confirm"}
            onClick={() => { }}
          >
            Stake
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
