import { Tooltip } from 'antd';
import NumericLabel from 'react-pretty-numbers';
import { adjustPrecision, formatLocalMap } from '../../helpers/Formats';
import i18n from 'i18next';
import DollarOutlined from '@ant-design/icons/DollarOutlined';

const AppProject = process.env.REACT_APP_ENVIRONMENT_APP_PROJECT;


const InfoIcon = ({infoDescription}) => {

    if (infoDescription !== '') {
        return (
            <Tooltip placement="topLeft" title={infoDescription}>
                <DollarOutlined className="LargeNumberIcon" />
            </Tooltip>
        );

    }
    return ('');

}

const USDValueLargeNumber = ({amountUSD, showUSD, numericLabelParams}) => {

    if (showUSD && amountUSD > 0) {
        const { value, decimals } = adjustPrecision(amountUSD, 'USD');
        const params = Object.assign(
            {
                shortFormat: true,
                justification: 'L',
                locales: i18n.languages[0],
                shortFormatMinValue: 1000000,
                commafy: true,
                shortFormatPrecision: decimals,
                precision: decimals,
                // without this the antd Tooltip isn't shown ¿¿?? hours wasted: 1.5
                title: '',
                cssClass: ['display-inline']
            },
            numericLabelParams
        );

        return (
            <span> ( <NumericLabel {...{ params }}>{value.toString()}</NumericLabel> USD ) </span>
        );

    }

    return ('');

}

const DetailedLargeNumber = ({ amount, currencyCode, includeCurrency, isPositive, showSign, showUSD, amountUSD, numericLabelParams, infoDescription, showFlat, t, i18n, ns  }) => {

    var displayCurrencyCode = ''
    if (currencyCode === 'RBTC') {
        displayCurrencyCode = 'RBTC';
        currencyCode = 'RESERVE';
    } else {
        displayCurrencyCode = t(`Tokens_${currencyCode}_code`, { ns: ns });
    }

    if (amount !== null && amount !== '' && !Number.isNaN(Number(amount))) {
        const { value, decimals } = adjustPrecision(amount, currencyCode,AppProject);
        const params = Object.assign(
            {
                shortFormat: true,
                justification: 'L',
                locales: i18n.languages[0],
                shortFormatMinValue: 1000000,
                commafy: true,
                shortFormatPrecision: decimals,
                precision: decimals,
                // without this the antd Tooltip isn't shown ¿¿?? hours wasted: 1.5
                title: '',
                cssClass: ['display-inline']
            },
            numericLabelParams
        );

        if (showFlat) {
            return value.toString();
        }

        if (infoDescription) {
            return (
                <div>
                    <Tooltip title={value === 0 ? '0' : value.toFormat(formatLocalMap[i18n.languages[0]])}>
                        {showSign && (isPositive ? '+' : '-')}
                        <NumericLabel {...{ params }}>{value.toString()}</NumericLabel>
                        {includeCurrency && ` ${displayCurrencyCode}`}
                        <USDValueLargeNumber amountUSD={amountUSD} showUSD={showUSD} numericLabelParams={numericLabelParams}></USDValueLargeNumber>
                    </Tooltip>
                    <InfoIcon infoDescription={infoDescription}></InfoIcon>
                </div>
            );

        }

        return (
            <Tooltip title={value === 0 ? '0' : value.toFormat(formatLocalMap[i18n.languages[0]])}>
                {showSign && (isPositive ? '+' : '-')}
                <NumericLabel {...{ params }}>{value.toString()}</NumericLabel>
                {includeCurrency && ` ${displayCurrencyCode}`}
                <USDValueLargeNumber amountUSD={amountUSD} showUSD={showUSD} numericLabelParams={numericLabelParams}></USDValueLargeNumber>
            </Tooltip>
        );
    }

    if (showFlat) {
        return '';
    }

    return (
        <Tooltip title={t(`general.invalidValueDescription`, {ns: ns })}>
            {t(`general.invalidValuePlaceholder`, {ns: ns })}
        </Tooltip>
    );
};

DetailedLargeNumber.defaultProps = {
    showFlat: false,
    showSign: false,
    showUSD: false,
    amountUSD: 0.0,
    infoDescription: ''
}

const getExplainByEvent = ({ event, amount, amount_rbtc, status, token_involved, t, i18n, ns }) => {
    if (status !== 'confirmed') {
        return '--';
    }

    const map = {
        RiskProMint: (
            <div>
                {t(`operations.explain.RiskProMint`, { ns: ns })} {amount}
            </div>
        ),
        RiskProRedeem: (
            <div>
                {t(`operations.explain.RiskProRedeem`, { ns: ns })} {amount_rbtc}
            </div>
        ),
        StableTokenMint: (
            <div>
                {t(`operations.explain.StableTokenMint`, { ns: ns })} {amount}
            </div>
        ),
        StableTokenRedeem: (
            <span>
                {t(`operations.explain.StableTokenRedeem`, { ns: ns })} {amount_rbtc}
            </span>
        ),
        FreeStableTokenRedeem: (
            <span>
                {t(`operations.explain.FreeStableTokenRedeem`, { ns: ns })} {amount_rbtc}
            </span>
        ),
        RiskProxMint: (
            <span>
                {t(`operations.explain.RiskProxMint`, { ns: ns })} {amount}
            </span>
        ),
        RiskProxRedeem: (
            <span>
                {t(`operations.explain.RiskProxRedeem`, { ns: ns })} {amount_rbtc}
            </span>
        ),
        SettlementDeleveraging: (
            <span>
                {t(`operations.explain.SettlementDeleveraging`, { ns: ns })} {amount_rbtc}
            </span>
        ),
        RedeemRequestAlter: (
            <span>
                {t(`operations.explain.RedeemRequestAlter`, { ns: ns })} {amount}
            </span>
        ),
        Transfer: (
            <span>
                {t(`operations.explain.Transfer_positive`, { ns: ns })} {amount}
            </span>
        ),
        BucketLiquidation: (
            <span>
                {t(`operations.explain.BucketLiquidation`, { ns: ns })} {amount}
            </span>
        )
    };

    return map[event];
};

export { DetailedLargeNumber, getExplainByEvent };

