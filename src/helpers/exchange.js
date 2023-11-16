import settings from '../settings/settings.json';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from './Formats';
import { TokenPrice, TokenSettings } from './currencies';
import { toContractPrecisionDecimals } from '../lib/backend/utils';
import {
    mintTC,
    redeemTC,
    mintTP,
    redeemTP
} from '../lib/backend/moc-rc20';

/*
const tokenMap = {
    CA_0: ['TC', 'TP_0', 'TP_1'],
    CA_1: ['TC', 'TP_0', 'TP_1'],
    TC: ['CA_0', 'CA_1'],
    TP_0: ['CA_0', 'CA_1'],
    TP_1: ['CA_0', 'CA_1']
};*/

function loadTokenMap() {

    const tMap = {}
    let lReceive = []

    // Exchange CA
    for (let i = 0; i < settings.tokens.CA.length; i++) {
        lReceive.push('TC')
        // TP
        for (let t = 0; t < settings.tokens.TP.length; t++) {
            lReceive.push(`TP_${t}`)
        }
        tMap[`CA_${i}`] = lReceive
    }

    // Exchange TC
    lReceive = []
    for (let i = 0; i < settings.tokens.CA.length; i++) {
        lReceive.push(`CA_${i}`)
    }
    tMap['TC'] = lReceive

    // Exchange TP
    lReceive = []
    for (let i = 0; i < settings.tokens.TP.length; i++) {
        // CA
        for (let a = 0; a < settings.tokens.CA.length; a++) {
            lReceive.push(`CA_${a}`)
        }
        tMap[`TP_${i}`] = lReceive
    }

    return tMap
}

const VERY_HIGH_NUMBER = 100000000000;

const tokenMap = loadTokenMap()
const tokenExchange = () => Object.keys(tokenMap);
const tokenReceive = (tExchange) => tokenMap[tExchange];

function isMintOperation(tokenExchange, tokenReceive) {
    /*
        case 'CA_0,TC':
        case 'CA_1,TC':
        case 'CA_0,TP_0':
        case 'CA_1,TP_0':
        case 'CA_0,TP_1':
        case 'CA_1,TP_1':
            // Mint
            return true;
        case 'TP_0,CA_0':
        case 'TP_0,CA_1':
        case 'TP_1,CA_0':
        case 'TP_1,CA_1':
        case 'TC,CA_0':
        case 'TC,CA_1':
            // Redeem
            return false;
    }
     */

    const aTokenExchange = tokenExchange.split('_')
    const aTokenReceive = tokenReceive.split('_')
    const aTokenMap = `${aTokenExchange[0]},${aTokenReceive[0]}`;
    switch (aTokenMap) {
        case 'CA,TC':
        case 'CA,TP':
            // Mint
            return true;
        case 'TP,CA':
        case 'TC,CA':
            // Redeem
            return false;
        default:
            throw new Error('Invalid token name');
    }
}

function TokenAllowance(auth, tokenExchange) {
    // Ex. tokenExchange = CA_0, CA_1, TP_0, TP_1, TC, COINBASE
    const tokenExchangeSettings = TokenSettings(tokenExchange);
    const aTokenExchange = tokenExchange.split('_')
    let allowance = 0;
    switch (aTokenExchange[0]) {
        case 'CA':
            allowance = auth.userBalanceData.CA[parseInt(aTokenExchange[1])].allowance;
            break;
        case 'TP':
            /*allowance = toContractPrecisionDecimals(
                new BigNumber(VERY_HIGH_NUMBER),
                tokenExchangeSettings.decimals
            );*/
            allowance = auth.userBalanceData.TP[parseInt(aTokenExchange[1])].allowance;
            break;
        case 'TC':
            allowance = auth.userBalanceData.TC.allowance;
            break;
        default:
            throw new Error('Invalid token name');
    }

    return allowance;
}

function UserTokenAllowance(auth, tokenExchange) {
    const tokenExchangeSettings = TokenSettings(tokenExchange);

    const allowance = new BigNumber(
        fromContractPrecisionDecimals(
            TokenAllowance(auth, tokenExchange),
            tokenExchangeSettings.decimals
        )
    );
    return allowance;
}

function ApproveTokenContract(dContracts, tokenExchange, tokenReceive) {
    const tokenExchangeSettings = TokenSettings(tokenExchange);

    const aTokenExchange = tokenExchange.split('_')
    const aTokenReceive = tokenReceive.split('_')
    const aTokenMap = `${aTokenExchange[0]},${aTokenReceive[0]}`;

    switch (aTokenMap) {
        case 'CA,TC':
        case 'CA,TP':
            return {
                token: dContracts.contracts.CA[parseInt(aTokenExchange[1])],
                contractAllow: dContracts.contracts.Moc,
                decimals: tokenExchangeSettings.decimals
            };
        case 'TC,CA':
            return {
                token: dContracts.contracts.TC,
                contractAllow: dContracts.contracts.Moc,
                decimals: tokenExchangeSettings.decimals
            };
        case 'TP,CA':
            return {
                token: dContracts.contracts.TP[parseInt(aTokenReceive[1])],
                contractAllow: dContracts.contracts.Moc,
                decimals: tokenExchangeSettings.decimals
            };
        default:
            throw new Error('Invalid token name');
    }
}

function TokenContract(dContracts, tokenExchange) {
    // Ex. aTokenMap = CA_0, CA_1, TP_0, TP_1, TC, COINBASE
    const tokenExchangeSettings = TokenSettings(tokenExchange);

    const tokenMap = `${tokenExchange}`;
    const aTokenMap = tokenMap.split('_')
    switch (aTokenMap[0]) {
        case 'CA':
            return {
                token: dContracts.contracts.CA[parseInt(aTokenMap[1])],
                decimals: tokenExchangeSettings.decimals
            }
        case 'TP':
            return {
                token: dContracts.contracts.TP[parseInt(aTokenMap[1])],
                decimals: tokenExchangeSettings.decimals
            }
        case 'TC':
            return {
                token: dContracts.contracts.TC,
                decimals: tokenExchangeSettings.decimals
            }
        default:
            throw new Error('Invalid token name');
    }
}

function exchangeMethod(
    interfaceContext,
    tokenExchange,
    tokenReceive,
    tokenAmount,
    limitAmount,
    onTransaction,
    onReceipt
) {
    let caIndex = 0;
    let tpIndex = 0;

    const aTokenExchange = tokenExchange.split('_')
    const aTokenReceive = tokenReceive.split('_')
    const aTokenMap = `${aTokenExchange[0]},${aTokenReceive[0]}`;

    switch (aTokenMap) {
        case 'CA,TC':
            caIndex = parseInt(aTokenExchange[1]);
            return mintTC(
                interfaceContext,
                tokenAmount,
                limitAmount,
                onTransaction,
                onReceipt
            );
        case 'TC,CA':
            caIndex = parseInt(aTokenReceive[1]);
            return redeemTC(
                interfaceContext,
                tokenAmount,
                limitAmount,
                onTransaction,
                onReceipt
            );
        case 'CA,TP':
            caIndex = parseInt(aTokenExchange[1]);
            tpIndex = parseInt(aTokenReceive[1]);
            return mintTP(
                interfaceContext,
                tpIndex,
                tokenAmount,
                limitAmount,
                onTransaction,
                onReceipt
            );
        case 'TP,CA':
            tpIndex = parseInt(aTokenExchange[1]);
            caIndex = parseInt(aTokenReceive[1]);
            return redeemTP(
                interfaceContext,
                tpIndex,
                tokenAmount,
                limitAmount,
                onTransaction,
                onReceipt
            );
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
    exchangeMethod,
    TokenContract
};
