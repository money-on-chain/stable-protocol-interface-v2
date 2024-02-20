import React, { useState, useContext, Fragment } from 'react'
import BigNumber from 'bignumber.js';
import { Button } from 'antd';

import { AuthenticateContext } from '../../context/Auth';
import { TokenSettings, TokenBalance, AmountToVisibleValue } from '../../helpers/currencies';
import { useProjectTranslation } from '../../helpers/translations';
import { tokenExchange } from '../../helpers/exchange';
import { PrecisionNumbers } from '../PrecisionNumbers';
import InputAmount from '../InputAmount';
import SelectCurrency from '../SelectCurrency';
const Stake = () => {
  const [t, i18n, ns] = useProjectTranslation();
  const auth = useContext(AuthenticateContext);
  const defaultTokenExchange = tokenExchange()[0];
  const [isDirtyYouExchange, setIsDirtyYouExchange] = useState(false);
  const [inputValidationErrorText, setInputValidationErrorText] = useState('');
  const [currencyYouExchange, setCurrencyYouExchange] = useState(defaultTokenExchange);
  const [amountYouExchange, setAmountYouExchange] = useState(
    new BigNumber(0)
  );
  const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
    onClear();
    setCurrencyYouExchange(newCurrencyYouExchange);
  };
  const onClear = () => {
    setIsDirtyYouExchange(false);
    setAmountYouExchange(new BigNumber(0));
  };
  const onChangeAmountYouExchange = (newAmount) => {

    setIsDirtyYouExchange(true);
    setAmountYouExchange(new BigNumber(newAmount));

    const usdAmount = ConvertAmount(
      auth,
      currencyYouExchange,
      'CA_0',
      newAmount,
      false
    );
    setExchangingUSD(usdAmount);

  };
  const setAddTotalAvailable = () => {

    setIsDirtyYouExchange(false);

    const tokenSettings = TokenSettings(currencyYouExchange);
    const totalYouExchange = new BigNumber(
      fromContractPrecisionDecimals(
        TokenBalance(auth, currencyYouExchange),
        tokenSettings.decimals
      )
    );
    setAmountYouExchange(totalYouExchange);
  };
  return (
    <Fragment>
      <div className="swap-from">
        <SelectCurrency
          className="select-token"
          value={currencyYouExchange}
          currencyOptions={tokenExchange()}
          onChange={onChangeCurrencyYouExchange}
        />

        <InputAmount
          InputValue={amountYouExchange.toString() === '0' ? 0 : AmountToVisibleValue(
            amountYouExchange,
            currencyYouExchange,
            3,
            false
          )}
          placeholder={'0.0'}
          onValueChange={onChangeAmountYouExchange}
          validateError={false}
          isDirty={isDirtyYouExchange}
          balance={
            PrecisionNumbers({
              amount: TokenBalance(auth, currencyYouExchange),
              token: TokenSettings(currencyYouExchange),
              decimals:
                TokenSettings(currencyYouExchange)
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
      <div className='staked-text'>{`${t('staking.staking.staked')}: 12345 MOC`}</div>
      <div className="action-section">
        <div className="left-column">
          <div className="title">Staking = 132 MOC</div>
          <Button
            type="primary"
            className={"primary-button btn-confirm"}
            onClick={() => {}}
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
