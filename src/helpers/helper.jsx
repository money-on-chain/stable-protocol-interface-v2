/* eslint-disable default-case */

import moment from 'moment';
import BigNumber from "bignumber.js";
import {DetailedLargeNumber, getExplainByEvent} from "../components/LargeNumber";
import settings from '../settings/settings.json'

export function TokenNameOldToNew(tokenName){
    let token = ''
    switch (tokenName) {
        case 'STABLE':
            token = 'TP';
            break;
        case 'RISKPRO':
            token = 'TC'
            break;
        case 'RISKPROX':
            token = 'TX'
            break;
        case 'MOC':
            token = 'TG'
            break;
        case 'TP':
            token = 'TP'
            break;
        case 'TC':
            token = 'TC'
            break;
        case 'TX':
            token = 'TX'
            break;
        case 'TG':
            token = 'TG'
            break;
        default:
            throw new Error('Invalid token name');
    }

    return token
}

export function TokenNameNewToOld(tokenName){
    let token = ''
    switch (tokenName) {
        case 'TP':
            token = 'STABLE';
            break;
        case 'TC':
            token = 'RISKPRO'
            break;
        case 'TX':
            token = 'RISKPROX'
            break;
        case 'TG':
            token = 'MOC'
            break;
        case 'all':
            token = 'all'
            break;
        default:
            throw new Error('Invalid token name');
    }

    return token
}


export function readJsonTable(data_j, t, i18n, ns){

    var set_event= "TRANSFER";
    if(data_j.event.includes("Mint")){set_event='MINT'}
    if(data_j.event.includes("Settlement")){set_event='SETTLEMENT'}
    if(data_j.event.includes("Redeem")){set_event='REDEEM'}

    data_j.tokenInvolved = TokenNameOldToNew(data_j.tokenInvolved)
    const set_asset = data_j.tokenInvolved;

    const set_status_txt= data_j.status;
    const set_status_percent= data_j.confirmingPercent;

    const wallet_detail= (data_j.userAmount!==undefined)? parseFloat(data_j.userAmount).toFixed(6)  : '--'
    const wallet_detail_usd=0;
    //const wallet_detail_usd= (wallet_detail * config.coin_usd).toFixed(2)
    const platform_detail= DetailedLargeNumber({
        amount: data_j.amount,
        currencyCode: data_j.tokenInvolved,
        includeCurrency: true,
        isPositive: data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDAmount ? data_j.USDAmount : 0,
        showUSD: false,
        t: t,
        i18n:i18n,
        ns:ns
    })
    //const platform_detail_usd= (platform_detail * config.coin_usd).toFixed(2)
    const platform_detail_usd = 0;
    const truncate_address= (data_j.address)? data_j.address.substring(0, 6) + '...' + data_j.address.substring(data_j.address.length - 4, data_j.address.length) : '--'
    const truncate_txhash= (data_j.transactionHash!==undefined)? data_j.transactionHash.substring(0, 6) + '...' + data_j.transactionHash.substring(data_j.transactionHash.length - 4, data_j.transactionHash.length) : '--'

    // const lastUpdatedAt= data_j.lastUpdatedAt
    const lastUpdatedAt= data_j.createdAt
        ? moment(data_j.createdAt).format('YYYY-MM-DD HH:mm:ss')
        : '--'
    const RBTCAmount= getExplainByEvent({
        event: data_j.event,
        amount: DetailedLargeNumber({
            amount: data_j.amount,
            currencyCode: data_j.tokenInvolved,
            includeCurrency: true,
            t: t,
            i18n:i18n,
            ns:ns
        }),
        amount_rbtc: DetailedLargeNumber({
            amount: data_j.RBTCTotal ? data_j.RBTCTotal : data_j.RBTCAmount,
            currencyCode: 'RESERVE',
            includeCurrency: true,
            t: t,
            i18n:i18n,
            ns:ns
        }),
        status: data_j.status,
        token_involved: t(`Tokens_${data_j.tokenInvolved}_code`, { ns: ns }),
        t: t,
        i18n:i18n,
        ns:ns
    })
    const confirmationTime= data_j.confirmationTime
    const address= (data_j.address !='')? data_j.address : '--'
    const amount=  DetailedLargeNumber({
        amount: data_j.amount,
        currencyCode: data_j.tokenInvolved,
        includeCurrency: true,
        isPositive: data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDAmount ? data_j.USDAmount : 0,
        showUSD: true,
        t: t,
        i18n:i18n,
        ns: ns
    })

    const platform_fee_value= DetailedLargeNumber({
         amount: new BigNumber(data_j.rbtcCommission).gt(0)
             ? data_j.rbtcCommission
             : data_j.mocCommissionValue,
         currencyCode: new BigNumber(data_j.rbtcCommission).gt(0) ? 'RESERVE' : 'TG',
         includeCurrency: true,
         amountUSD: data_j.USDCommission ? data_j.USDCommission : 0,
         showUSD: true,
         t: t,
         i18n:i18n,
         ns:ns
    })

    const blockNumber= (data_j.blockNumber!==undefined)? data_j.blockNumber : '--'
    const wallet_value= DetailedLargeNumber({
        amount: data_j.RBTCTotal ? data_j.RBTCTotal : data_j.RBTCAmount,
        currencyCode: 'RESERVE',
        includeCurrency: true,
        isPositive: !data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDTotal ? data_j.USDTotal : 0,
        showUSD: true,
        t: t,
        i18n:i18n,
        ns:ns
    })

    const interests= DetailedLargeNumber({
        amount: data_j.rbtcInterests,
        currencyCode: 'RESERVE',
        includeCurrency: true,
        amountUSD: data_j.USDInterests ? data_j.USDInterests : 0,
        showUSD: true,
        isPositive: data_j.event == 'RiskProxRedeem' ? false : true,
        showSign: data_j.event == 'RiskProxRedeem' ? true : undefined,
        infoDescription: data_j.event == 'RiskProxRedeem' ? 'Credit interest' : undefined,
        t: t,
        i18n:i18n,
        ns:ns
    })
    const tx_hash_truncate= (data_j.transactionHash!==undefined)? truncate_txhash : '--'
    const tx_hash= (data_j.transactionHash!==undefined)? data_j.transactionHash : '--'

    const gas_fee= DetailedLargeNumber({
        amount: data_j.gasFeeRBTC,
        currencyCode: 'RBTC',
        includeCurrency: true,
        amountUSD: data_j.gasFeeUSD ? data_j.gasFeeUSD : 0,
        showUSD: true,
        t: t,
        i18n:i18n,
        ns:ns
    })

    const price= DetailedLargeNumber({
        amount: data_j.reservePrice,
        currencyCode: 'USD',
        includeCurrency: true,
        t: t,
        i18n:i18n,
        ns:ns
    })

    const wallet_value_main= DetailedLargeNumber({
        amount: data_j.RBTCTotal ? data_j.RBTCTotal : data_j.RBTCAmount,
        currencyCode: 'RESERVE',
        includeCurrency: true,
        isPositive: !data_j.isPositive,
        showSign: true,
        amountUSD: data_j.USDTotal ? data_j.USDTotal : 0,
        showUSD: false,
        t: t,
        i18n:i18n,
        ns:ns
    })

    const leverage=  DetailedLargeNumber({
        amount: data_j.leverage,
        currencyCode: data_j.tokenInvolved,
        t: t,
        i18n:i18n,
        ns:ns
        })

    return {
        set_event:set_event,
        set_asset:set_asset,
        set_status_txt:set_status_txt,
        set_status_percent:set_status_percent,
        wallet_detail:wallet_detail,
        wallet_detail_usd:wallet_detail_usd,
        platform_detail_usd:platform_detail_usd,
        platform_detail:platform_detail,
        truncate_address:truncate_address,
        truncate_txhash:truncate_txhash,
        lastUpdatedAt:lastUpdatedAt,
        RBTCAmount:RBTCAmount,
        confirmationTime:confirmationTime,
        address:address,
        amount:amount,
        platform_fee_value:platform_fee_value,
        blockNumber:blockNumber,
        wallet_value:wallet_value,
        interests:interests,
        tx_hash_truncate:tx_hash_truncate,
        tx_hash:tx_hash,
        gas_fee:gas_fee,
        price:price,
        wallet_value_main:wallet_value_main,
        leverage:leverage
    }

}

export const myParseDate = date_string => {
    let [y,M,d,h,m,s] = date_string.split(/[- :T]/);
    return new Date(y,parseInt(M)-1,d,h,parseInt(m),s.replace('Z',''));
}

export function getCoinName(coin){

    let currencies = {
        'COINBASE': settings.tokens.COINBASE.name,
        'TP': settings.tokens.TP[0].name,
        'TC': settings.tokens.TC.name,
        'TX': 'TX',
        'RESERVE':settings.tokens.COINBASE.name,
        'USDPrice': 'USD',
        'TG': 'TG',
        'USD':'USD',
    }

    return currencies[coin]
}

export function getDecimals(coin,AppProject){
    let decimals= {
        'COINBASE': 6,
        'TP': 2,
        'TC': 6,
        'TX': 6,
        'TG': 2,
        'USDPrice': 2,
        'RESERVE': 6,
        'USD':2,
        'REWARD': 6,
        'DOC':2,
        'TXInterest': 6
    }

    return decimals[coin]

}
