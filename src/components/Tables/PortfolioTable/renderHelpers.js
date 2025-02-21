import BigNumber from "bignumber.js";
// import { PrecisionNumbers } from "../../PrecisionNumbers";
import NumericLabel from "react-pretty-numbers";
import settings from "../../../settings/settings.json";
// import { fromContractPrecisionDecimals } from "../../../helpers/Formats";

export const generateTokenRow = ({
    key,
    label,
    tokenIcon,
    tokenName,
    tokenTicker,
    balance,
    price,
    balanceUSD,
    priceDelta,
    variation,
    decimals,
    // settings,
    auth,
    t,
    i18n,
    ns,
    params,
}) => {
    const getSign = () => {
        if (priceDelta.isZero()) return "";
        return priceDelta.isPositive() ? "+" : "-";
    };

    const variationFormat = variation.toFormat(decimals, BigNumber.ROUND_UP, {
        decimalSeparator: t("numberFormat.decimalSeparator"),
        groupSeparator: t("numberFormat.thousandsSeparator"),
    });

    return {
        key,
        renderRow: (
            <div className="table__row">
                {/* Token icon, name, and ticker */}
                <div className="table__cell__name">
                    <div className="token">
                        <div className={`${tokenIcon} token__icon`}></div>
                        <span className="token__name">{tokenName}</span>
                        <span className="token__ticker">({tokenTicker})</span>
                    </div>
                </div>
                {/* Token price */}
                <div className="table__cell table__cell__price">
                    <NumericLabel {...{ params }}>{price}</NumericLabel>
                    <div className="table__cell__label">{label.price}</div>
                </div>
                {/* Token 24h variation */}
                {!settings.showPriceVariation ||
                !auth.contractStatusData.canOperate ? (
                    <div className="table__cell">
                        <div className="table__cell__variation"></div>
                    </div>
                ) : (
                    <div className="table__cell">
                        <div className="table__cell__variation">
                            {`${getSign()} `}
                            <NumericLabel {...{ params }}>
                                {variationFormat}
                            </NumericLabel>
                            {" %"}
                            <span
                                className={`variation-indicator ${
                                    getSign() === "+"
                                        ? "positive-indicator"
                                        : getSign() === "-"
                                          ? "negative-indicator"
                                          : "neutral-indicator"
                                }`}
                            ></span>
                        </div>
                        <div className="table__cell__label">
                            {label.variation}
                        </div>
                    </div>
                )}
                {/* Token balance */}
                <div className="table__cell table__cell__amount">
                    <NumericLabel {...{ params }}>{balance}</NumericLabel>{" "}
                    <div className="token__ticker">
                        {/* {tokenTicker}  */}
                        {/* show token ticker after balance */}
                        <div className="table__cell__label">
                            {label.balance}
                        </div>
                    </div>
                </div>
                {/* Token balance in USD */}
                <div className="table__cell table__cell__usdBalance">
                    <NumericLabel {...{ params }}>{balanceUSD}</NumericLabel>
                    <div className="table__cell__label">{label.usdBalance}</div>
                </div>
            </div>
        ),
    };
};
