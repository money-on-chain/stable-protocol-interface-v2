import { ReactComponent as LogoIconCA_0 } from '../assets/icons/tokens/ca_0.svg';
import { ReactComponent as LogoIconCA_1 } from '../assets/icons/tokens/ca_1.svg';
import { ReactComponent as LogoIconCOINBASE } from '../assets/icons/tokens/coinbase.svg';
import { ReactComponent as LogoIconTC } from '../assets/icons/tokens/tc.svg';
import { ReactComponent as LogoIconTP_0 } from '../assets/icons/tokens/tp_0.svg';
import { ReactComponent as LogoIconTP_1 } from '../assets/icons/tokens/tp_1.svg';


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


export {
  getCurrenciesDetail
}