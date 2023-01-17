import settings from '../settings/settings.json';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from './Formats';
import { TokenSettings } from './currencies';

const tokenMap = {
    "CA_0": ["TC", "TP_0", "TP_1"],
    "CA_1": ["TC", "TP_0", "TP_1"],
    "TC": ["CA_0", "CA_1"],
    "TP_0": ["CA_0", "CA_1"],
    "TP_1": ["CA_0", "CA_1"]
}

const tokenExchange = () => Object.keys(tokenMap);
const tokenReceive = (tExchange) => tokenMap[tExchange];

function isMintOperation(tokenExchange, tokenReceive) {

    const tokenMap = `${tokenExchange},${tokenReceive}`
    switch (tokenMap) {
        case 'CA_0,TC':
        case 'CA_1,TC':
        case 'CA_0,TP_0':
        case 'CA_1,TP_0':
        case 'CA_0,TP_1':
        case 'CA_1,TP_1':
            // Mint
            return true
        case 'TP_0,CA_0':
        case 'TP_0,CA_1':
        case 'TP_1,CA_0':
        case 'TP_1,CA_1':
        case 'TC,CA_0':
        case 'TC,CA_1':
            // Redeem
            return false
        default:
            throw new Error('Invalid token name');
    }

}


export {
    tokenExchange,
    tokenReceive,
    isMintOperation
}