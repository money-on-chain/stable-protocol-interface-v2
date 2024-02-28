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

    // If is very big number
    if (amountBig.gte(new BigNumber(115792089237316200000000000000000000))) {
        return (<span>Infinity +</span>)
    } else {
        return (
            <Tooltip title={amountBig.eq(0) ? '0' : amountBig}>
                <NumericLabel {...{ params }}>{amountFormat}</NumericLabel>
            </Tooltip>
        );
    }


};

export { PrecisionNumbers };
