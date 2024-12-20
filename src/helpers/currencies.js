import { ReactComponent as LogoIconCA_0 } from '../assets/icons/tokens/ca_0.svg';
import { ReactComponent as LogoIconCA_1 } from '../assets/icons/tokens/ca_1.svg';
import { ReactComponent as LogoIconCOINBASE } from '../assets/icons/tokens/coinbase.svg';
import { ReactComponent as LogoIconTC } from '../assets/icons/tokens/tc.svg';
import { ReactComponent as LogoIconTP_0 } from '../assets/icons/tokens/tp_0.svg';
import { ReactComponent as LogoIconTP_1 } from '../assets/icons/tokens/tp_1.svg';
import { ReactComponent as LogoIconTG_0 } from '../assets/icons/tokens/tg_0.svg';
import settings from '../settings/settings.json';
import BigNumber from 'bignumber.js';
import { fromContractPrecisionDecimals } from './Formats';

const currencies = [
    { value: 'CA_0', image: <LogoIconCA_0 className="token__icon" /> },
    { value: 'CA_1', image: <LogoIconCA_1 className="token__icon" /> },
    { value: 'TC', image: <LogoIconTC className="token__icon" /> },
    {
        value: 'COINBASE',
        image: <LogoIconCOINBASE className="token__icon" />
    },
    { value: 'TP_0', image: <LogoIconTP_0 className="token__icon" /> },
    { value: 'TP_1', image: <LogoIconTP_1 className="token__icon" /> },
    { value: 'TF', image: <LogoIconTG_0 className="token__icon" /> },
    { value: 'TG', image: <LogoIconTG_0 className="token__icon" /> }
].map((it) => ({
    ...it
}));

const getCurrenciesDetail = () => currencies;

function TokenSettings(tokenName) {
    // Ex. tokenName = CA_0, CA_1, TP_0, TP_1, TC, COINBASE
    const aTokenName = tokenName.split('_');
    let token = settings.tokens.CA[0];
    switch (aTokenName[0]) {
        case 'CA':
            token = settings.tokens.CA[parseInt(aTokenName[1])];
            break;
        case 'TP':
            token = settings.tokens.TP[parseInt(aTokenName[1])];
            break;
        case 'TC':
            token = settings.tokens.TC;
            break;
        case 'COINBASE':
            token = settings.tokens.COINBASE;
            break;
        case 'TF':
            token = settings.tokens.TF;
            break;
        case 'TG':
            token = settings.tokens.TG;
            break;
        default:
            throw new Error('Invalid token name');
    }

    return token;
}

function TokenBalance(auth, tokenName) {
    // Ex. tokenName = CA_0, CA_1, TP_0, TP_1, TC, COINBASE
    let balance = 0;

    if (!auth.userBalanceData) return balance;

    const aTokenName = tokenName.split('_');
    switch (aTokenName[0]) {
        case 'CA':
            balance = auth.userBalanceData.CA[parseInt(aTokenName[1])].balance;
            break;
        case 'TP':
            balance = auth.userBalanceData.TP[parseInt(aTokenName[1])].balance;
            break;
        case 'TC':
            balance = auth.userBalanceData.TC.balance;
            break;
        case 'COINBASE':
            balance = auth.userBalanceData.coinbase;
            break;
        case 'TF':
            balance = auth.userBalanceData.FeeToken.balance;
            break;
        case 'TG':
            balance = auth.userBalanceData.TG.balance;
            break;
        default:
            throw new Error('Invalid token name');
    }

    return balance;
}

function ConvertPeggedTokenPrice(auth, price) {
    switch (process.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()) {
        case 'flipmoney':
            const priceCA = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.PP_CA[0], settings.tokens.CA[0].decimals));
            return price.div(priceCA);
        case 'roc':
            return price;
        default:
            return price;
    }
}

function TokenPrice(auth, tokenName) {
    // Ex. tokenName = CA_0, CA_1, TP_0, TP_1, TC, COINBASE
    let price = 0;

    if (!auth.contractStatusData) return 0;

    const aTokenName = tokenName.split('_');
    switch (aTokenName[0]) {
        case 'CA':
            price = auth.contractStatusData.PP_CA[parseInt(aTokenName[1])];
            break;
        case 'TP':
            price = auth.contractStatusData.PP_TP[parseInt(aTokenName[1])];
            break;
        case 'TC':
            price = auth.contractStatusData.getPTCac;
            break;
        case 'COINBASE':
            price = auth.contractStatusData.PP_COINBASE;
            break;
        case 'TG':
            price = auth.contractStatusData.PP_FeeToken;
            break;

        default:
            throw new Error('Invalid token name');
    }

    return price;
}

function ConvertBalance(auth, tokenExchange, tokenReceive) {
    const rawAmount = TokenBalance(auth, tokenExchange);
    return ConvertAmount(auth, tokenExchange, tokenReceive, rawAmount);
}

function ConvertAmount(auth, tokenExchange, tokenReceive, rawAmount, amountInWei = true) {
    const tokenExchangeSettings = TokenSettings(tokenExchange);
    const tokenReceiveSettings = TokenSettings(tokenReceive);
    let price = new BigNumber(0);

    let amount;
    if (amountInWei) {
        amount = new BigNumber(fromContractPrecisionDecimals(rawAmount, tokenReceiveSettings.decimals));
    } else {
        amount = new BigNumber(rawAmount);
    }

    let cAmount = new BigNumber(0);

    // [tokenExchange,tokenReceive]
    //const tokenMap = `${tokenExchange},${tokenReceive}`;
    const aTokenExchange = tokenExchange.split('_');
    const aTokenReceive = tokenReceive.split('_');
    const aTokenMap = `${aTokenExchange[0]},${aTokenReceive[0]}`;

    switch (aTokenMap) {
        case 'CA,TC':
            price = new BigNumber(fromContractPrecisionDecimals(TokenPrice(auth, tokenReceive), tokenReceiveSettings.decimals));
            cAmount = amount.div(price);
            break;
        case 'TP,CA':
            // Redeem Operation
            price = new BigNumber(fromContractPrecisionDecimals(TokenPrice(auth, tokenExchange), tokenExchangeSettings.decimals));
            cAmount = amount.div(price);
            break;
        case 'CA,TP':
            // Mint Operation
            price = new BigNumber(fromContractPrecisionDecimals(TokenPrice(auth, tokenReceive), tokenReceiveSettings.decimals));
            cAmount = amount.times(price);
            break;
        case 'TC,CA':
            // Redeem Operation
            price = new BigNumber(fromContractPrecisionDecimals(TokenPrice(auth, tokenExchange), tokenExchangeSettings.decimals));
            cAmount = amount.times(price);
            break;
        case 'TG,CA':
            // TG
            price = new BigNumber(fromContractPrecisionDecimals(TokenPrice(auth, tokenExchange), tokenExchangeSettings.decimals));
            cAmount = amount.times(price);
            break;
        case 'COINBASE,CA':
            // COINBASE
            price = new BigNumber(fromContractPrecisionDecimals(TokenPrice(auth, tokenExchange), tokenExchangeSettings.decimals));
            cAmount = amount.times(price);
            break;
        case 'CA,CA':
            cAmount = amount;
            break;
        default:
            throw new Error('Invalid token name');
    }

    return cAmount;
}

const precision = (contractDecimals) => new BigNumber(10).exponentiatedBy(contractDecimals);

const AmountToVisibleValue = (rawAmount, tokenName, decimals, amountInWei = true) => {
    console.log('tokenname is ', tokenName);
    const tokenSettings = TokenSettings(tokenName);

    let amount;
    if (amountInWei) {
        amount = new BigNumber(fromContractPrecisionDecimals(rawAmount, tokenSettings.decimals));
    } else {
        amount = new BigNumber(rawAmount);
    }
    return amount.toFormat(decimals, BigNumber.ROUND_DOWN, {
        decimalSeparator: '.',
        groupSeparator: ','
    });
};

function CalcCommission(auth, tokenExchange, tokenReceive, rawAmount, amountInWei = true) {
    // Calc commissions

    const tokenExchangeSettings = TokenSettings(tokenExchange);
    const tokenReceiveSettings = TokenSettings(tokenReceive);

    let amount;
    if (amountInWei) {
        amount = new BigNumber(fromContractPrecisionDecimals(rawAmount, tokenExchangeSettings.decimals));
    } else {
        amount = new BigNumber(rawAmount);
    }

    let feeParam;

    const tokenMap = `${tokenExchange},${tokenReceive}`;
    const aTokenExchange = tokenExchange.split('_');
    const aTokenReceive = tokenReceive.split('_');
    const aTokenMap = `${aTokenExchange[0]},${aTokenReceive[0]}`;

    switch (aTokenMap) {
        case 'CA,TC':
            // Mint TC
            feeParam = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.tcMintFee, tokenReceiveSettings.decimals));
            break;
        case 'TP,CA':
            // Redeem TP
            feeParam = new BigNumber(
                fromContractPrecisionDecimals(auth.contractStatusData.tpRedeemFees[parseInt(aTokenExchange[1])], tokenReceiveSettings.decimals)
            );
            break;
        case 'CA,TP':
            // Mint TP
            feeParam = new BigNumber(
                fromContractPrecisionDecimals(auth.contractStatusData.tpMintFees[parseInt(aTokenReceive[1])], tokenReceiveSettings.decimals)
            );
            break;
        case 'TC,CA':
            // Redeem TC
            feeParam = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.tcRedeemFee, tokenReceiveSettings.decimals));
            break;
        default:
            throw new Error('Invalid token name');
    }

    // Fee Paying with Token
    const feeTokenPrice = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.PP_FeeToken,
            tokenReceiveSettings.decimals
        )
    );
    const feeTokenPct = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.feeTokenPct,
            tokenReceiveSettings.decimals
        )
    );
    const priceCA = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.PP_CA[0],
            settings.tokens.CA[0].decimals
        )
    );
    const qFeeToken = amount.times(feeParam.times(feeTokenPct))

    // Markup Vendors
    const vendorMarkup = new BigNumber(
        fromContractPrecisionDecimals(
            auth.contractStatusData.vendorMarkup,
            tokenReceiveSettings.decimals
        )
    );
    const markOperation = amount.times(vendorMarkup)

    // Total fee token
    const totalFeeToken = qFeeToken.plus(markOperation)

    const feeInfo = {
        fee: amount.times(feeParam).plus(markOperation),
        feeUSD: amount.times(feeParam).plus(markOperation).times(priceCA),
        percent: feeParam.plus(vendorMarkup).times(100),
        markup: vendorMarkup,
        markOperation: markOperation,
        feeTokenPrice: feeTokenPrice,
        feeTokenPct: feeTokenPct,
        totalFeeToken: totalFeeToken.div(feeTokenPrice),
        totalFeeTokenUSD: totalFeeToken.times(priceCA),
        feeTokenPercent: feeParam.times(feeTokenPct).plus(vendorMarkup).times(100)
    };

    return feeInfo;
}

/*
function CalcCommission(auth, tokenExchange, tokenReceive, rawAmountYouExchange, rawAmountYouReceive, amountInWei=true) {
  // Calc commissions

  const tokenExchangeSettings = TokenSettings(tokenExchange)
  const tokenReceiveSettings = TokenSettings(tokenReceive)

  let amountYouExchange
  let amountYouReceive
  if (amountInWei) {
    amountYouExchange = new BigNumber(fromContractPrecisionDecimals(rawAmountYouExchange, tokenExchangeSettings.decimals))
    amountYouReceive = new BigNumber(fromContractPrecisionDecimals(rawAmountYouReceive, tokenReceiveSettings.decimals))
  } else {
    amountYouExchange = new BigNumber(rawAmountYouExchange)
    amountYouReceive = new BigNumber(rawAmountYouReceive)
  }

  let feeParam;
  let feeAmount;
  const tokenMap = `${tokenExchange},${tokenReceive}`
  switch (tokenMap) {
    case 'CA_0,TC':
    case 'CA_1,TC':
      // Mint TC
      feeParam = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.tcMintFee, tokenReceiveSettings.decimals))
      feeAmount = amountYouExchange.times(feeParam)
      break
    case 'TP_0,CA_0':
    case 'TP_0,CA_1':
      // Redeem TP 0
      feeParam = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.tpRedeemFee[0], tokenReceiveSettings.decimals))
      feeAmount = amountYouReceive.times(feeParam)
      break
    case 'TP_1,CA_0':
    case 'TP_1,CA_1':
      // Redeem TP 1
      feeParam = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.tpRedeemFee[1], tokenReceiveSettings.decimals))
      feeAmount = amountYouReceive.times(feeParam)
      break
    case 'CA_0,TP_0':
    case 'CA_1,TP_0':
      // Mint TP 0
      feeParam = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.tpMintFee[0], tokenReceiveSettings.decimals))
      feeAmount = amountYouExchange.times(feeParam)
      break
    case 'CA_0,TP_1':
    case 'CA_1,TP_1':
      // Mint TP 1
      feeParam = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.tpMintFee[1], tokenReceiveSettings.decimals))
      feeAmount = amountYouExchange.times(feeParam)
      break
    case 'TC,CA_0':
    case 'TC,CA_1':
      // Redeem TC
      feeParam = new BigNumber(fromContractPrecisionDecimals(auth.contractStatusData.tcRedeemFee, tokenReceiveSettings.decimals))
      feeAmount = amountYouReceive.times(feeParam)
      break
    default:
      throw new Error('Invalid token name');
  }

  const feeInfo = {
    fee: feeAmount,
    percent: feeParam.times(100)
  }

  return feeInfo
}
*/

function AmountsWithCommissions(
    auth,
    tokenExchange,
    tokenReceive,
    rawAmountYouExchange,
    rawAmountYouReceive,
    rawCommissionsValue,
    amountInWei = true
) {
    // Commissions in CA

    const tokenExchangeSettings = TokenSettings(tokenExchange);
    const tokenReceiveSettings = TokenSettings(tokenReceive);
    const commissionsValueSettings = TokenSettings('CA_0');

    let amountYouExchange;
    let amountYouReceive;
    let commissionsValue;
    if (amountInWei) {
        amountYouExchange = new BigNumber(fromContractPrecisionDecimals(rawAmountYouExchange, tokenExchangeSettings.decimals));
        amountYouReceive = new BigNumber(fromContractPrecisionDecimals(rawAmountYouReceive, tokenReceiveSettings.decimals));
        commissionsValue = new BigNumber(fromContractPrecisionDecimals(rawCommissionsValue, commissionsValueSettings.decimals));
    } else {
        amountYouExchange = new BigNumber(rawAmountYouExchange);
        amountYouReceive = new BigNumber(rawAmountYouReceive);
        commissionsValue = new BigNumber(rawCommissionsValue);
    }

    const tokenMap = `${tokenExchange},${tokenReceive}`;
    const aTokenExchange = tokenExchange.split('_');
    const aTokenReceive = tokenReceive.split('_');
    const aTokenMap = `${aTokenExchange[0]},${aTokenReceive[0]}`;

    switch (aTokenMap) {
        case 'CA,TC':
        case 'CA,TP':
            // Mint
            amountYouExchange = amountYouExchange.plus(commissionsValue);
            break;
        case 'TP,CA':
        case 'TC,CA':
            // Redeem
            amountYouReceive = amountYouReceive.minus(commissionsValue);
            break;
        default:
            throw new Error('Invalid token name');
    }

    const amountsInfo = {
        amountYouExchange: amountYouExchange,
        amountYouReceive: amountYouReceive
    };

    return amountsInfo;
}

export {
    getCurrenciesDetail,
    TokenSettings,
    TokenBalance,
    TokenPrice,
    ConvertBalance,
    ConvertAmount,
    AmountToVisibleValue,
    CalcCommission,
    AmountsWithCommissions,
    ConvertPeggedTokenPrice
};
