import { Tooltip } from 'antd';
import NumericLabel from 'react-pretty-numbers';
import BigNumber from 'bignumber.js';

const fromContractPrecisionDecimals = (amount, decimals) => {
    return new BigNumber(amount).div(
        new BigNumber(10).exponentiatedBy(decimals)
    );
};

const PrecisionNumbers = ({
    amount,
    token,
    decimals,
    numericLabelParams,
    t,
    i18n,
    ns,
    skipContractConvert
}) => {
    console.log('amount is ', amount);
    console.log('token is ', token);
    let amountBig;
    if (skipContractConvert) {
        amountBig = amount;
    } else {
        amountBig = fromContractPrecisionDecimals(amount, token.decimals);
    }

    if (!decimals) {
        decimals = token.visibleDecimals;
    }

    const amountFormat = amountBig.toFormat(decimals, BigNumber.ROUND_UP, {
        decimalSeparator: '.',
        groupSeparator: ','
    });

    const params = Object.assign(
        {
            shortFormat: true,
            justification: 'L',
            locales: i18n.languages[0],
            shortFormatMinValue: 1000000,
            commafy: true,
            shortFormatPrecision: decimals,
            precision: decimals,
            title: '',
            cssClass: ['display-inline']
        },
        numericLabelParams
    );

    return (
        <Tooltip title={amountBig.eq(0) ? '0' : amountBig}>
            <NumericLabel {...{ params }}>{amountFormat}</NumericLabel>
        </Tooltip>
    );
};

export { PrecisionNumbers };
