import {
  formatValueWithContractPrecision,
  formatValueToContract,
  // precision,
  // RBTCPrecision
} from './Formats';
import { toBigNumber, minimum } from './numberHelper';

const BigNumber = require('bignumber.js');

const convertAmount = (source, target, amount, convertToken) => {
  if (amount === '') {
    return '';
  }
  // if (TAPi18n.getLanguage() === 'es') {
  //   amount = amount.toLocaleString(TAPi18n.getLanguage());
  // }
  const convertedAmount = formatValueWithContractPrecision(
    convertToken(source, target, formatValueToContract(amount, source)),
    target
  );
  return isNaN(convertedAmount) ? '' : convertedAmount.toString();
};

const amountIsTooSmall = target => {
  const minorValue = BigNumber('0.0000000000000000001');
  return minorValue.gt(toBigNumber(target));
};

const getUsableReserveBalance = (
  currencyToMint,
  userState,
  mocState,
  convertToken
) => {
  const {
    rbtcBalance = 0,
    spendableBalance = 0,
    potentialBprox2MaxInterest = 0,
  } = userState || {};
  const gasEstimation = gasMintingEstimation(
    currencyToMint,
    userState
  );

  const spendableBalanceBn = toBigNumber(rbtcBalance);
  const mintingGasEstimation = gasEstimation !== undefined ? gasEstimation : 0;
};

const gasMintingEstimation = (
  currencyToMint,
  userState
) => {
  const {
    estimateGasMintDoc = 0,
    estimateGasMintBpro = 0,
    estimateGasMintBprox2 = 0
  } = userState || {};

  switch (currencyToMint) {
    case 'STABLE':
      return estimateGasMintDoc;
    case 'RISKPRO':
      return estimateGasMintBpro;
    case 'RISKPROX':
      return estimateGasMintBprox2;
    default:
      return undefined;
  }
};

const canPayCommissionInMoc = (commissionValue, userState) => {
  return (enoughMOCBalance(commissionValue, userState) && enoughMOCAllowance(commissionValue, userState));
}

const enoughMOCAllowance = (commissionValue, userState) => {
  const { mocAllowance = '0' } = userState || {};
  return BigNumber(mocAllowance).gt(0) && BigNumber(mocAllowance).gte(commissionValue);
}

const enoughMOCBalance = (commissionValue, userState) => {
  const { mocBalance = '0' } = userState || {};
  return BigNumber(mocBalance).gte(commissionValue);
}


const getMaxMintableBalance = (currencyToMint, userState, mocState, convertToken) => {
  const usableReserveBalance = getUsableReserveBalance(
    currencyToMint,
    userState,
    mocState,
    convertToken
  );
  const {
    docAvailableToMint,
    bprox2AvailableToMint,
  } = mocState;
  const usableReserveBalanceInCurrencyToMint = convertToken("RESERVE", currencyToMint, usableReserveBalance);
  let response;
  switch (currencyToMint) {
    case 'STABLE':
      response = {
        value: minimum(docAvailableToMint,
                      usableReserveBalanceInCurrencyToMint),
        currency: "STABLE"
      };
      break;
    case 'RISKPRO':
      response = {
        value: usableReserveBalanceInCurrencyToMint,
        currency: "RISKPRO"
      };
      break;
    case 'RISKPROX':
      response = {
        value: minimum(bprox2AvailableToMint,
                      usableReserveBalanceInCurrencyToMint),
        currency: "RISKPROX"
      };
      break;
    default:
      response = undefined;
      break;
  }
  return response;
}

const getMaxRedeemableBalance = (currencyToRedeem, userState, mocState) => {
  const {
    bproBalance = 0,
    bprox2Balance = 0,
    docBalance = 0,
  } = userState || {};
  const {
    docAvailableToRedeem,
    bproAvailableToRedeem
  } = mocState;
  let response;
  switch (currencyToRedeem) {
    case 'STABLE':
      response = {
        value: minimum(docAvailableToRedeem, docBalance),
        currency: "STABLE"
      };
      break;
    case 'RISKPRO':
      response = {
        value: minimum(bproAvailableToRedeem, bproBalance),
        currency: "RISKPRO"
      }
      break;
    case 'RISKPROX':
      response = {
        value: bprox2Balance,
        currency: "RISKPROX"
      };
      break;
    default:
      response = undefined;
      break;
  }
  return response;
}

const isAmountBiggerThanMax = (amount, currency, maxAvailable) => {
  const bdInputAmount = toBigNumber(formatValueToContract(amount, currency));
  return !bdInputAmount.isNaN() && bdInputAmount.isGreaterThan(maxAvailable);
};
const isAmountZero = amount => amount.eq(BigNumber('0'));

export {
  convertAmount,
  isAmountBiggerThanMax,
  isAmountZero,
  getMaxMintableBalance,
  getMaxRedeemableBalance,
  amountIsTooSmall,
  getUsableReserveBalance,
  canPayCommissionInMoc
};
