import PropTypes from 'prop-types';

import { PrecisionNumbers } from "../../PrecisionNumbers";
import settings from "../../../settings/settings.json";


export const generateTokenRow = ({
    key,
    label,
    tokenIcon,
    tokenName,
    tokenTicker,
    price,
    balance,
    balanceUSD,
    priceDelta,
    variation,
    visiblePriceDecimals,
    visibleBalanceDecimals,
    visibleBalanceUSDDecimals,
    auth,
    i18n
}) => {
    const getSign = () => {
        if (priceDelta.isZero()) return "";
        return priceDelta.isPositive() ? "+" : "-";
    };

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
                    {/*console.log(
                        "ASI LLEGA EL PRICE ",
                        tokenName,
                        "   ",
                        price
                    )*/}
                    {auth.contractStatusData.canOperate ? (
                        <PrecisionNumbers
                            amount={price}
                            token={{
                                decimals: { visiblePriceDecimals }, // Precisión en el contrato (aunque aquí no importa mucho)
                                visibleDecimals: { visiblePriceDecimals }, // Define que queremos mostrar 4 decimales
                            }}
                            decimals={visiblePriceDecimals} // Asegura que se rendericen 4 decimales
                            i18n={i18n}
                            skipContractConvert={true}
                        />
                    ) : (
                        <>--</>
                    )}
                    <div className="table__cell__label">{label.price}</div>
                </div>

                {/* Token 24h variation */}
                {settings.showPriceVariation ? (
                    <div className="table__cell">
                        {auth.contractStatusData.canOperate ? (
                            <div className="table__cell__variation">
                                {`${getSign()} `}
                                <PrecisionNumbers
                                    amount={variation.abs()}
                                    token={{
                                        decimals: 2,
                                        visibleDecimals: 2,
                                    }}
                                    decimals={2}
                                    i18n={i18n}
                                    skipContractConvert={true}
                                />
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
                        ) : (
                            <>
                                <div className="table__cell__variation">--</div>
                                <div className="table__cell__label">
                                    {label.variation}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="table__cell">
                        <div className="table__cell table__cell__price"></div>
                    </div>
                )}
                {/* Token balance */}
                <div className="table__cell table__cell__amount">
                    <PrecisionNumbers
                        amount={balance}
                        token={{
                            decimals: { visibleBalanceDecimals }, // Precisión en el contrato (aunque aquí no importa mucho)
                            visibleDecimals: { visibleBalanceDecimals }, // Define que queremos mostrar 4 decimales
                        }}
                        decimals={visibleBalanceDecimals} // Asegura que se rendericen 4 decimales
                        i18n={i18n}
                        skipContractConvert={true}
                    />{" "}
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
                    {auth.contractStatusData.canOperate ? (
                        <PrecisionNumbers
                            amount={balanceUSD}
                            token={{
                                decimals: { visibleBalanceUSDDecimals }, // Precisión en el contrato (aunque aquí no importa mucho)
                                visibleDecimals: { visibleBalanceUSDDecimals }, // Define que queremos mostrar 4 decimales
                            }}
                            decimals={visibleBalanceUSDDecimals} // Asegura que se rendericen 4 decimales
                            i18n={i18n}
                            skipContractConvert={true}
                        />
                    ) : (
                        <>--</>
                    )}
                    <div className="table__cell__label">{label.usdBalance}</div>
                </div>
            </div>
        ),
    };
};

generateTokenRow.propTypes = {
    key: PropTypes.string,
    label: PropTypes.string,
    tokenIcon: PropTypes.string,
    tokenName: PropTypes.string,
    tokenTicker: PropTypes.string,
    price: PropTypes.object,
    balance: PropTypes.object,
    balanceUSD: PropTypes.object,
    priceDelta: PropTypes.object,
    variation: PropTypes.object,
    visiblePriceDecimals: PropTypes.number,
    visibleBalanceDecimals: PropTypes.number,
    visibleBalanceUSDDecimals: PropTypes.number,
    auth: PropTypes.object,
    i18n: PropTypes.object
};
