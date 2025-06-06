import React, { useContext } from "react";
import BigNumber from "bignumber.js";

import { useProjectTranslation } from "../../../helpers/translations";
import { AuthenticateContext } from "../../../context/Auth";
import settings from "../../../settings/settings.json";
import { fromContractPrecisionDecimals } from "../../../helpers/Formats";
import { PrecisionNumbers } from "../../PrecisionNumbers";
import PortfolioTable from "../../Tables/PortfolioTable";

export default function Portfolio() {
    const space = "\u00A0";
    const { t, i18n } = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    let balance;
    let price;
    let balanceUSD;
    let totalUSD = new BigNumber(0);

    // Total tokens

    // Tokens CA
    auth.contractStatusData &&
        auth.userBalanceData &&
        settings.tokens.CA.forEach(function (dataItem) {
            balance = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.userBalanceData.CA[dataItem.key].balance,
                    settings.tokens.CA[dataItem.key].decimals
                )
            );
            price = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.contractStatusData.PP_CA[dataItem.key],
                    settings.tokens.CA[dataItem.key].decimals
                )
            );
            balanceUSD = balance.times(price);
            totalUSD = totalUSD.plus(balanceUSD);
        });

    // Tokens TP
    auth.contractStatusData &&
        auth.userBalanceData &&
        settings.tokens.TP.forEach(function (dataItem) {
            balance = new BigNumber(
                fromContractPrecisionDecimals(
                    auth.userBalanceData.TP[dataItem.key].balance,
                    settings.tokens.TP[dataItem.key].decimals
                )
            );
            price = dataItem.peggedUSD
                ? 1
                : new BigNumber(
                      fromContractPrecisionDecimals(
                          auth.contractStatusData.PP_TP[dataItem.key],
                          settings.tokens.TP[dataItem.key].decimals
                      )
                  );
            balanceUSD = balance.div(price);
            totalUSD = totalUSD.plus(balanceUSD);
        });

    if (auth.contractStatusData && auth.userBalanceData) {
        // Token TC
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.TC.balance,
                settings.tokens.TC[0].decimals
            )
        );
        const priceTEC = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.getPTCac,
                settings.tokens.TC[0].decimals
            )
        );
        const priceCA = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_CA[0],
                settings.tokens.CA[0].decimals
            )
        );

        if (auth.contractStatusData.canOperate) {
            price = priceTEC.times(priceCA);
            balanceUSD = balance.times(price);
            totalUSD = totalUSD.plus(balanceUSD);
        }

        // Coinbase
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.coinbase,
                settings.tokens.COINBASE[0].decimals
            )
        );
        price = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_COINBASE,
                settings.tokens.COINBASE[0].decimals
            )
        );
        balanceUSD = balance.times(price);
        totalUSD = totalUSD.plus(balanceUSD);

        // Fee Token (TF) the price provider is expressed in collateral
        balance = new BigNumber(
            fromContractPrecisionDecimals(
                auth.userBalanceData.FeeToken.balance,
                settings.tokens.TF[0].decimals
            )
        );
        const priceInCA = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.PP_FeeToken,
                settings.tokens.TF[0].decimals
            )
        );
        balanceUSD = balance.times(priceInCA).times(priceCA);
        totalUSD = totalUSD.plus(balanceUSD);
    }

    return (
        <div className="dashboard-portfolio">
            <div className="tokens-card-content">
                <div className="tokens-list-header">
                    <div className="tokens-list-header-title layout-card-title">
                        <h1>{t("portfolio.sectionTitle")}</h1>
                    </div>
                    <div className="tokens-list-header-balance">
                        <div className="tokens-list-header-balance-number">
                            {auth.contractStatusData &&
                            !auth.contractStatusData.canOperate
                                ? "--"
                                : PrecisionNumbers({
                                      amount: totalUSD,
                                      token: settings.tokens.COINBASE[0],
                                      decimals: 2,
                                      i18n: i18n,
                                      skipContractConvert: true,
                                  })}
                            {space}
                            {t("portfolio.totalCurrency")}
                        </div>
                        <div className="tokens-list-header-balance-title">
                            {t("portfolio.totalBalance")}
                        </div>
                    </div>
                </div>
                <div className="tokens-list-table">
                    <PortfolioTable />
                </div>
            </div>
        </div>
    );
}
