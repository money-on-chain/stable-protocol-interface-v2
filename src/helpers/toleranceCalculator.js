import BigNumber from 'bignumber.js';

import { isMintOperation } from './exchange';

function getMaxWithTolerance(
  newTolerance,
  amountYouExchange,
  amountYouReceive,
  currencyYouExchange,
  currencyYouReceive
) {
  let limitExchange;
  let limitReceive;
  const IS_MINT = isMintOperation(currencyYouExchange, currencyYouReceive);
  if (IS_MINT) {
    limitExchange = new BigNumber(amountYouExchange)
      .times(new BigNumber(newTolerance))
      .div(100)
      .minus(new BigNumber(amountYouExchange))
      .abs();
    limitReceive = amountYouReceive;
  } else {
    limitExchange = amountYouExchange;
    limitReceive = new BigNumber(amountYouReceive)
      .times(new BigNumber(newTolerance))
      .div(100)
      .plus(new BigNumber(amountYouReceive))
      .abs();
  }
  const limits = {
    exchange: limitExchange,
    receive: limitReceive
  };
  return limits;
}

export { getMaxWithTolerance};