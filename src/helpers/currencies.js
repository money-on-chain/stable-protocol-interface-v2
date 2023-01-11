import { ReactComponent as LogoIconCA_0 } from '../assets/icons/tokens/ca_0.svg';
import { ReactComponent as LogoIconCA_1 } from '../assets/icons/tokens/ca_1.svg';
import { ReactComponent as LogoIconCOINBASE } from '../assets/icons/tokens/coinbase.svg';
import { ReactComponent as LogoIconTC } from '../assets/icons/tokens/tc.svg';
import { ReactComponent as LogoIconTP_0 } from '../assets/icons/tokens/tp_0.svg';
import { ReactComponent as LogoIconTP_1 } from '../assets/icons/tokens/tp_1.svg';
import settings from '../settings/settings.json';


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
      balance = auth.userBalanceData.TP[0].balance;
      break;
    case 'TP_1':
      balance = auth.userBalanceData.TP[1].balance;
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


export {
  getCurrenciesDetail,
  TokenSettings,
  TokenBalance,
  TokenPrice
}