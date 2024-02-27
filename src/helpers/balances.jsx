import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { setToLocaleString, setNumber } from './helper';

/*function getUSD(coin,value,auth,i18n=null){*/
const getUSD = (coin, value, auth, i18n = null) => {
    if (auth.contractStatusData) {
        switch (coin) {
            case 'TP':
                return setToLocaleString(
                    new BigNumber(1 * Web3.utils.fromWei(setNumber(value))),
                    2,
                    i18n
                );
            case 'TC':
                return setToLocaleString(
                    new BigNumber(
                        Web3.utils.fromWei(
                            auth.contractStatusData['bproPriceInUsd']
                        ) * Web3.utils.fromWei(setNumber(value))
                    ),
                    2,
                    i18n
                );
            case 'TG':
                return setToLocaleString(
                    new BigNumber(
                        Web3.utils.fromWei(
                            auth.contractStatusData['mocPrice']
                        ) * Web3.utils.fromWei(setNumber(value))
                    ),
                    2,
                    i18n
                );
            case 'RESERVE':
                return setToLocaleString(
                    new BigNumber(
                        Web3.utils.fromWei(
                            auth.contractStatusData.bitcoinPrice
                        ) * Web3.utils.fromWei(setNumber(value))
                    ),
                    2,
                    i18n
                );
            case 'TX':
                return setToLocaleString(
                    new BigNumber(
                        Web3.utils.fromWei(
                            auth.contractStatusData.bitcoinPrice,
                            'ether'
                        ) *
                            Web3.utils.fromWei(
                                auth.contractStatusData['bprox2PriceInRbtc'],
                                'ether'
                            ) *
                            Web3.utils.fromWei(setNumber(value))
                    ),
                    2,
                    i18n
                );
        }
    } else {
        return 0;
    }
};

export {
    getUSD
};
