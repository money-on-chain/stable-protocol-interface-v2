import { ReactComponent as LogoIconCA_0 } from '../assets/icons/tokens/ca_0.svg';
import { ReactComponent as LogoIconCA_1 } from '../assets/icons/tokens/ca_1.svg';
import { ReactComponent as LogoIconCOINBASE } from '../assets/icons/tokens/coinbase.svg';
import { ReactComponent as LogoIconTC } from '../assets/icons/tokens/tc.svg';
import { ReactComponent as LogoIconTP_0 } from '../assets/icons/tokens/tp_0.svg';
import { ReactComponent as LogoIconTP_1 } from '../assets/icons/tokens/tp_1.svg';
import settings from '../settings/settings.json';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from './Formats';


const currencies = [
  { value: 'CA_0', image: <LogoIconCA_0 className="currencyImage" /> },
  { value: 'CA_1', image: <LogoIconCA_1 className="currencyImage" /> },
  { value: 'TC', image: <LogoIconTC className="currencyImage" /> },
  { value: 'COINBASE', image: <LogoIconCOINBASE className="currencyImage" /> },
  { value: 'TP_0', image: <LogoIconTP_0 className="currencyImage" /> },
  { value: 'TP_1', image: <LogoIconTP_1 className="currencyImage" /> },
].map(it => ({
  ...it
}));

const getCurrenciesDetail = () => currencies;

function TokenSettings(tokenName) {

  let token = settings.tokens.CA[0];
  switch (tokenName) {
    case 'CA_0':
      token = settings.tokens.CA[0];
      break;
    case 'CA_1':
      token = settings.tokens.CA[1];
      break;
    case 'TP_0':
      token = settings.tokens.TP[0];
      break;
    case 'TP_1':
      token = settings.tokens.TP[1];
      break;
    case 'TC':
      token = settings.tokens.TC;
      break;
    case 'COINBASE':
      token = settings.tokens.COINBASE;
      break;
    default:
      throw new Error('Invalid token name');
  }

  return token
}

function TokenBalance(auth, tokenName) {

  let balance = 0;
  switch (tokenName) {
    case 'CA_0':
      balance = auth.userBalanceData.CA[0].balance;
      break;
    case 'CA_1':
      balance = auth.userBalanceData.CA[1].balance;
      break;
    case 'TP_0':
      balance = auth.userBalanceData.TP[0];
      break;
    case 'TP_1':
      balance = auth.userBalanceData.TP[1];
      break;
    case 'TC':
      balance = auth.userBalanceData.TC.balance;
      break;
    case 'COINBASE':
      balance = auth.userBalanceData.coinbase;
      break;
    default:
      throw new Error('Invalid token name');
  }

  return balance
}

function TokenPrice(auth, tokenName) {

  let price = 0;
  switch (tokenName) {
    case 'CA_0':
      price = auth.contractStatusData.PP_CA[0];
      break;
    case 'CA_1':
      price = auth.contractStatusData.PP_CA[1];
      break;
    case 'TP_0':
      price = auth.contractStatusData.PP_TP[0];
      break;
    case 'TP_1':
      price = auth.contractStatusData.PP_TP[1];
      break;
    case 'TC':
      price = auth.contractStatusData.getPTCac;
      break;
    case 'COINBASE':
      price = auth.contractStatusData.PP_COINBASE;
      break;
    default:
      throw new Error('Invalid token name');
  }

  return price
}

function ConvertBalance(auth, tokenExchange, tokenReceive) {
  const rawAmount = TokenBalance(auth, tokenExchange)
  return ConvertAmount(auth, tokenExchange, tokenReceive, rawAmount)
}

function ConvertAmount(auth, tokenExchange, tokenReceive, rawAmount, amountInWei=true) {

  const tokenExchangeSettings = TokenSettings(tokenExchange)
  const tokenReceiveSettings = TokenSettings(tokenReceive)
  let price = new BigNumber(0)

  let amount
  if (amountInWei) {
    amount = new BigNumber(fromContractPrecisionDecimals(rawAmount, tokenReceiveSettings.decimals))
  } else {
    amount = new BigNumber(rawAmount)
  }

  let cAmount = new BigNumber(0)

  // [tokenExchange,tokenReceive]
  const tokenMap = `${tokenExchange},${tokenReceive}`
  switch (tokenMap) {
    case 'CA_0,TC':
    case 'CA_1,TC':
      price = new BigNumber(fromContractPrecisionDecimals(TokenPrice(auth, tokenReceive), tokenReceiveSettings.decimals))
      cAmount = amount.div(price)
      break
    case 'TP_0,CA_0':
    case 'TP_1,CA_0':
    case 'TP_0,CA_1':
    case 'TP_1,CA_1':
      // Redeem Operation
      price = new BigNumber(fromContractPrecisionDecimals(TokenPrice(auth, tokenExchange), tokenExchangeSettings.decimals))
      cAmount = amount.div(price)
      break
    case 'CA_0,TP_0':
    case 'CA_1,TP_0':
    case 'CA_0,TP_1':
    case 'CA_1,TP_1':
      // Mint Operation
      price = new BigNumber(fromContractPrecisionDecimals(TokenPrice(auth, tokenReceive), tokenReceiveSettings.decimals))
      cAmount = amount.times(price)
      break
    case 'TC,CA_0':
    case 'TC,CA_1':
      // Redeem Operation
      price = new BigNumber(fromContractPrecisionDecimals(TokenPrice(auth, tokenExchange), tokenExchangeSettings.decimals))
      cAmount = amount.times(price)
      break
    default:
      throw new Error('Invalid token name');
  }

  return cAmount

}

const precision = (contractDecimals) => new BigNumber(10).exponentiatedBy(contractDecimals)

const AmountToVisibleValue = (rawAmount, tokenName, decimals, amountInWei=true) => {
  const tokenSettings = TokenSettings(tokenName)

  let amount
  if (amountInWei) {
    amount = new BigNumber(fromContractPrecisionDecimals(rawAmount, tokenSettings.decimals))
  } else {
    amount = new BigNumber(rawAmount)
  }
  return amount.toFormat(decimals, BigNumber.ROUND_DOWN, {
    decimalSeparator: '.',
    groupSeparator: ','
  })

  /*return BigNumber(amount).div(precision(tokenSettings.decimals)).toFormat(decimals, BigNumber.ROUND_DOWN, {
    decimalSeparator: '.',
    groupSeparator: ','
  })*/
}


export {
  getCurrenciesDetail,
  TokenSettings,
  TokenBalance,
  TokenPrice,
  ConvertBalance,
  ConvertAmount,
  AmountToVisibleValue
}