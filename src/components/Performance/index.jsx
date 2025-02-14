import React, { useContext, useState, useEffect } from "react";
import BigNumber from "bignumber.js";

import { useProjectTranslation } from "../../helpers/translations";
import { AuthenticateContext } from "../../context/Auth";
import { PrecisionNumbers } from "../PrecisionNumbers";
import { TokenSettings } from "../../helpers/currencies";
import CollateralAssets from "./collateral";
import TokensPegged from "./tokenspegged";
import TokensPeggedMobile from "./tokenspeggedmobile";
import CheckStatus from "../../helpers/checkStatus";
import { fromContractPrecisionDecimals } from "../../helpers/Formats";
import settings from "../../settings/settings.json";

export default function Performance() {
    //const [isValid, setIsValid] = useState(true);
    const [statusIcon, setStatusIcon] = useState("");
    const [statusLabel, setStatusLabel] = useState("--");
    const [statusText, setStatusText] = useState("--");
    const {t, i18n, ns} = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const { checkerStatus } = CheckStatus();
    useEffect(() => {
        if ((auth.contractStatusData, auth.userBalanceData)) {
            const { statusIcon, statusLabel, statusText } =
                checkerStatus();
            //setIsValid(isValid);
            setStatusIcon(statusIcon);
            setStatusLabel(statusLabel);
            setStatusText(statusText);
        }
    }, [auth.contractStatusData, auth.userBalanceData]);

    let price;
    let collateralInUSD;
    if (auth.contractStatusData) {
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
        price = priceTEC.times(priceCA);

        const collateralTotal = new BigNumber(
            fromContractPrecisionDecimals(
                auth.contractStatusData.nACcb,
                settings.tokens.TC[0].decimals
            )
        );
        collateralInUSD = collateralTotal.times(priceCA);
    }
    return (
        <div className="section sectionPerformance">
            {/* System Status */}
            <div className="section__innerCard--small dash__perfSystemStatus">
                <div className="card-system-status">
                    <div className="layout-card-title">
                        <h1>{t("performance.status.cardTitle")}</h1>
                    </div>

                    <div className="card-content">
                        <div className="coll-1">
                            <div className="stat-text">{statusText}</div>
                        </div>
                        <div className="coll-2">
                            <div className="stat-icon">
                                <div className={`${statusIcon}`}></div>
                                {statusLabel}
                            </div>
                            <div className="block-info">
                                {t("performance.status.showingBlock")}
                                {auth.contractStatusData
                                    ? BigInt(
                                          auth.contractStatusData.blockHeight
                                      ).toString()
                                    : "--"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Total Value Locked */}
            <div className="section__innerCard--small dash__perfTVL">
                <div className="layout-card-title">
                    <h1>{t("performance.tvl.cardTitle")}</h1>
                </div>

                <div className="card-content">
                    <div className="big-number">
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: collateralInUSD
                                      ? collateralInUSD
                                      : new BigNumber(0),
                                  token: TokenSettings("CA_0"),
                                  decimals: 2,
                                  i18n: i18n,
                                  skipContractConvert: true,
                              })}
                    </div>
                    <div className="caption">
                        {t("performance.tvl.expressedIn")}
                    </div>
                </div>
            </div>
            {/* Leveraged Token */}
            <div className="section__innerCard--small dash__perfLeveraged">
                <div className="token">
                    <div className="icon-token-tc token__icon"></div>
                    <div className="token__name">
                        {t(`exchange.tokens.TC.label`, { ns: ns })}
                    </div>
                </div>

                <div className="card-content">
                    <div className="amount">
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: price,
                                  token: settings.tokens.TC[0],
                                  decimals: 8,
                                  i18n: i18n,
                                  skipContractConvert: true,
                              })}
                        <div className="caption">
                            {t("performance.tc.priceIn")}
                        </div>
                    </div>
                    <div className="amount">
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: auth.contractStatusData
                                      ? auth.contractStatusData.getLeverageTC
                                      : new BigNumber(0),
                                  token: TokenSettings("TC"),
                                  decimals: 8,
                                  i18n: i18n,
                                  skipContractConvert: false,
                              })}
                        <div className="caption">
                            {t("performance.tc.currentLeverage")}
                        </div>
                    </div>
                    <div className="amount">
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: auth.contractStatusData
                                      ? auth.contractStatusData.nTCcb
                                      : new BigNumber(0),
                                  token: TokenSettings("TC"),
                                  decimals: 2,
                                  i18n: i18n,
                                  skipContractConvert: false,
                              })}
                        <div className="caption">
                            {t("performance.tc.totalInSystem")}
                        </div>
                    </div>
                    <div className="amount">
                        {!auth.contractStatusData.canOperate
                            ? "--"
                            : PrecisionNumbers({
                                  amount: auth.contractStatusData
                                      ? auth.contractStatusData
                                            .getTCAvailableToRedeem
                                      : new BigNumber(0),
                                  token: TokenSettings("TC"),
                                  decimals: 2,
                                  i18n: i18n,
                                  skipContractConvert: false,
                              })}{" "}
                        <div className="caption">
                            {t("performance.tc.redeemable")}
                        </div>
                    </div>
                </div>
            </div>
            {/* System Collateral */}
            <div className="section__innerCard--small dash__perfCollateral">
                <div className="layout-card-title">
                    <h1>{t("performance.collateral.cardTitle")}</h1>
                </div>

                <div className="card-content">
                    <div className="dash__perfCollateral__dash">
                        <div className="amount">
                            {!auth.contractStatusData.canOperate
                                ? "--"
                                : PrecisionNumbers({
                                      amount: collateralInUSD
                                          ? collateralInUSD
                                          : new BigNumber(0),
                                      token: TokenSettings("CA_0"),
                                      decimals: 2,
                                      i18n: i18n,
                                      skipContractConvert: true,
                                  })}
                            <div className="caption">
                                {t("performance.collateral.totalIn")}
                            </div>
                        </div>
                        <div className="amount">
                            {!auth.contractStatusData.canOperate
                                ? "--"
                                : PrecisionNumbers({
                                      amount: auth.contractStatusData
                                          ? auth.contractStatusData.getCglb
                                          : new BigNumber(0),
                                      token: TokenSettings("CA_0"),
                                      decimals: 6,
                                      i18n: i18n,
                                      skipContractConvert: false,
                                  })}{" "}
                            <div className="caption">
                                {t("performance.collateral.globalCoverage")}
                            </div>
                        </div>
                    </div>

                    <div className="row-2">
                        <CollateralAssets />
                    </div>
                </div>
            </div>
            {/* Pegged tokens Performance Table */}
            <div className="section__innerCard--big dash__perfPegged">
                <div className="desktop-only">
                    <TokensPegged />
                </div>
                <div className="mobile-only">
                    <TokensPeggedMobile />
                </div>
            </div>
        </div>
    );
}
