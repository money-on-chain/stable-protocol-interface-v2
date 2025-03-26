import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import BigNumber from "bignumber.js";
import PropTypes from "prop-types";

import { useProjectTranslation } from "../../helpers/translations";
import { PrecisionNumbers } from "../PrecisionNumbers";
import settings from "../../settings/settings.json";

const PieChartComponent = (props) => {
    const { t, i18n } = useProjectTranslation();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(new BigNumber(0));
    const { userInfoStaking } = props;
    const space = "\u00A0";

    useEffect(() => {
        readData();
    }, [
        userInfoStaking["tgBalance"],
        userInfoStaking["stakedBalance"],
        userInfoStaking["totalPendingExpiration"],
        userInfoStaking["totalAvailableToWithdraw"],
        userInfoStaking["lockedInVoting"],
    ]);

    const readData = () => {
        const total = getTotal();
        const _data = [
            {
                type: t("staking.distribution.graph.balance"),
                value: total.gt(0)
                    ? BigNumber(userInfoStaking["tgBalance"])
                          .div(total)
                          .times(100)
                          .toNumber()
                    : 0,
            },
            {
                type: t("staking.distribution.graph.processingUnstake"),
                value: total.gt(0)
                    ? BigNumber(userInfoStaking["totalPendingExpiration"])
                          .div(total)
                          .times(100)
                          .toNumber()
                    : 0,
            },
            {
                type: t("staking.distribution.graph.readyWithdraw"),
                value: total.gt(0)
                    ? BigNumber(userInfoStaking["totalAvailableToWithdraw"])
                          .div(total)
                          .times(100)
                          .toNumber()
                    : 0,
            },
            {
                type: t("staking.distribution.graph.staked"),
                value: total.gt(0)
                    ? BigNumber(userInfoStaking["stakedBalance"])
                          .minus(userInfoStaking["lockedInVoting"])
                          .div(total)
                          .times(100)
                          .toNumber()
                    : 0,
            },
            {
                type: "Staked in voting",
                value: total.gt(0)
                    ? BigNumber(userInfoStaking["lockedInVoting"])
                          .div(total)
                          .times(100)
                          .toNumber()
                    : 0,
            },
        ];
        // START TEST

        // const _data = [
        //     { type: "See code", value: 5 },
        //     { type: "Uncomment", value: 20 },
        //     { type: "And remove", value: 30 },
        //     { type: "Placeholder _data", value: 45 },
        // ];
        // END TEST
        setData(_data);
        setTotal(total);
    };

    const getTotal = () => {
        return BigNumber.sum(
            userInfoStaking["tgBalance"],
            new BigNumber(userInfoStaking["stakedBalance"]).minus(
                new BigNumber(userInfoStaking["lockedInVoting"])
            ),
            userInfoStaking["totalPendingExpiration"],
            userInfoStaking["totalAvailableToWithdraw"],
            userInfoStaking["lockedInVoting"]
        );
    };

    // Retrieve CSS color variables
    const colorBalance = getComputedStyle(
        document.querySelector(":root")
    ).getPropertyValue("--brand-color-darker");
    const colorProcessing = getComputedStyle(
        document.querySelector(":root")
    ).getPropertyValue("--brand-color-dark");
    const colorReady = getComputedStyle(
        document.querySelector(":root")
    ).getPropertyValue("--brand-color-base");
    const colorStaked = getComputedStyle(
        document.querySelector(":root")
    ).getPropertyValue("--brand-color-light");
    const colorStakedInVoting = getComputedStyle(
        document.querySelector(":root")
    ).getPropertyValue("--brand-color-lighter");

    // Custom color palette for the pie chart
    const pieColorPalette = [
        colorBalance,
        colorProcessing,
        colorReady,
        colorStaked,
        colorStakedInVoting,
    ];

    return (
        <div>
            <div className="pie-chart-total">
                <div className="pie-chart-total-amount">
                    {PrecisionNumbers({
                        amount: total,
                        token: settings.tokens.TG[0],
                        decimals: 2,
                        i18n: i18n,
                        skipContractConvert: true,
                    })}
                    {space}
                    {t("staking.governanceToken")}
                </div>
                <div className="pie-chart-total-title">
                    {t("staking.distribution.graph.totalLabel")}
                </div>
            </div>
            <div className="pie-chart-container">
                {/* ResponsiveContainer ensures the chart fits the container */}
                <ResponsiveContainer width="100%" height={230}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        pieColorPalette[
                                            index % pieColorPalette.length
                                        ]
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="dataContainer">
                <div className="dataLabels">
                    {data.map((item) => (
                        <div key={item.type} className="data-row">
                            <div className="data-bullet"></div>
                            <div>{item.type}: </div>
                            <div className="data-numbers">
                                {item.value.toFixed(2)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PieChartComponent;

PieChartComponent.propTypes = {
    userInfoStaking: PropTypes.object,
};
