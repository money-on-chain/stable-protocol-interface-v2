import { ReactComponent as LogoIconReserve } from '../assets/icons/icon-reserve.svg';
import { ReactComponent as LogoIconTP } from '../assets/icons/icon-tp.svg';
import { ReactComponent as LogoIconTC } from '../assets/icons/icon-tc.svg';
import { ReactComponent as LogoIconTX } from '../assets/icons/icon-tx.svg';
import { ReactComponent as LogoIconTG } from '../assets/icons/icon-tg.svg';
import { ReactComponent as LogoIconRBTC } from '../assets/icons/icon-tg.svg';


const currencies = [
  { value: 'RESERVE', image: <LogoIconReserve className="currencyImage" /> },
  { value: 'TP', image: <LogoIconTP className="currencyImage" /> },
  { value: 'TC', image: <LogoIconTC className="currencyImage" /> },
  { value: 'TX', image: <LogoIconTX className="currencyImage" /> },
  { value: 'TG', image: <LogoIconTG className="currencyImage" /> },
  { value: 'RBTC', image: <LogoIconRBTC className="currencyImage" /> },
].map(it => ({
  ...it,
  longNameKey: `${process.env.REACT_APP_ENVIRONMENT_APP_PROJECT}.Tokens_${it.value}_code`,
}));

const getCurrenciesDetail = () => currencies;


export {
  currencies,
  getCurrenciesDetail
}