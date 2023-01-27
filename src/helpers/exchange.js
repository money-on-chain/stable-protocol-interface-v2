import settings from '../settings/settings.json';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from './Formats';
import { TokenPrice, TokenSettings } from './currencies';
import { toContractPrecisionDecimals } from '../lib/integration/utils';
import { mintTC } from '../lib/integration/interfaces-collateral-bag';

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

function TokenAllowance(auth, tokenExchange) {

    const tokenExchangeSettings = TokenSettings(tokenExchange)

    let allowance = 0;
    switch (tokenExchange) {
        case 'CA_0':
            allowance = auth.userBalanceData.CA[0].allowance;
            break;
        case 'CA_1':
            allowance = auth.userBalanceData.CA[1].allowance;
            break;
        case 'TP_0':
            allowance = toContractPrecisionDecimals(Number.MAX_SAFE_INTEGER.toString(), tokenExchangeSettings.decimals);
            break;
        case 'TP_1':
            allowance = toContractPrecisionDecimals(Number.MAX_SAFE_INTEGER.toString(), tokenExchangeSettings.decimals);
            break;
        case 'TC':
            allowance = auth.userBalanceData.TC.allowance;
            break;
        default:
            throw new Error('Invalid token name');
    }

    return allowance
}

function UserTokenAllowance(auth, tokenExchange) {
    const tokenExchangeSettings = TokenSettings(tokenExchange)
    const allowance = new BigNumber(fromContractPrecisionDecimals(TokenAllowance(auth, tokenExchange), tokenExchangeSettings.decimals))
    return allowance
}

function ApproveTokenContract(dContracts, tokenExchange, tokenReceive) {

    const tokenExchangeSettings = TokenSettings(tokenExchange)

    const tokenMap = `${tokenExchange},${tokenReceive}`
    switch (tokenMap) {
        case 'CA_0,TC':
        case 'CA_0,TP_0':
        case 'CA_0,TP_1':
            return {
                token: dContracts.contracts.CA[0],
                contractAllow: dContracts.contracts.MocCAWrapper,
                decimals: tokenExchangeSettings.decimals
            }
        case 'CA_1,TC':
        case 'CA_1,TP_0':
        case 'CA_1,TP_1':
            return {
                token: dContracts.contracts.CA[1],
                contractAllow: dContracts.contracts.MocCAWrapper,
                decimals: tokenExchangeSettings.decimals
            }
        case 'TC,CA_0':
        case 'TC,CA_1':
            return {
                token: dContracts.contracts.TC,
                contractAllow: dContracts.contracts.MocCAWrapper,
                decimals: tokenExchangeSettings.decimals
            }
        case 'TP_0,CA_0':
        case 'TP_0,CA_1':
        case 'TP_1,CA_0':
        case 'TP_1,CA_1':
            return {
                token: null,
                contractAllow: null,
                decimals: null
            }
        default:
            throw new Error('Invalid token name');
    }

}


function exchangeMethod(interfaceContext, tokenExchange, tokenReceive, tokenAmount, limitAmount, onTransaction, onReceipt) {

    let caIndex = 0
    const tokenMap = `${tokenExchange},${tokenReceive}`
    switch (tokenMap) {
        case 'CA_0,TC':
            caIndex = 0
            return mintTC(interfaceContext, caIndex, tokenAmount, limitAmount, onTransaction, onReceipt)//.then((value => {
            //}))
        case 'CA_1,TC':
            caIndex = 1
            return mintTC(interfaceContext, caIndex, tokenAmount, limitAmount, onTransaction, onReceipt)//.then((value => {
            //}))
        case 'CA_0,TP_0':
        case 'CA_1,TP_0':
        case 'CA_0,TP_1':
        case 'CA_1,TP_1':
        case 'TP_0,CA_0':
        case 'TP_0,CA_1':
        case 'TP_1,CA_0':
        case 'TP_1,CA_1':
        case 'TC,CA_0':
        case 'TC,CA_1':
            // Not available now
            throw new Error('Invalid Exchange Method. Not available now!');
        default:
            throw new Error('Invalid Exchange Method');
    }

}



export {
    tokenExchange,
    tokenReceive,
    isMintOperation,
    UserTokenAllowance,
    ApproveTokenContract,
    exchangeMethod
}