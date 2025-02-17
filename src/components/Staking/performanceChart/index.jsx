import React, { useState } from "react";

import { useProjectTranslation } from "../../../helpers/translations";
import "./Styles.scss";

export default function PerformanceChart() {
    const [percent, setPercent] = useState(0);
    const { t } = useProjectTranslation();

    let height = percent && percent > 0 ? (percent * 190) / 100 : 0;
    fetch(
        "https://api.moneyonchain.com/api/calculated/moc_last_block_performance"
    )
        .then(async (response) => {
            const data = await response.json();
            setPercent(data.annualized_value.toFixed(2));
        })
        .catch((error) => {
            console.log(error);
            setPercent(0);
        });

    return (
        <div className="ChartContainer">
            <div className="ChartText">
                <div className="percent">{percent > 0 && `${percent}%`}</div>
                <div className="percent-note">
                    {t("staking.performance.bar.description")}
                </div>
            </div>
            <div className="ChartGraphic">
                <div className="ChartColumn">
                    <div className="Bar Percent Hidden" style={{ height }} />
                    <div className="Bar">
                        <div>{t("staking.performance.bar.base")}</div>
                    </div>
                </div>
                <div className="ChartColumn">
                    <div className="Bar Percent Gray" style={{ height }} />
                    <div className="Bar">
                        <div>
                            {t("staking.performance.bar.base")}
                            <br />
                            {t("staking.performance.bar.sign")}
                            <br />
                            {t("staking.performance.bar.staking")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
