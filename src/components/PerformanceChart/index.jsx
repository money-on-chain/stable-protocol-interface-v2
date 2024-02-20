import React, { useState } from 'react';
import { Row, Col, Tabs } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import './style.scss';

export default function PerformanceChart(props) {
    const [percent, setPercent] = useState(0);
    const [t, i18n, ns] = useProjectTranslation();

    let height = percent && percent > 0 ? (percent * 190) / 100 : 0;
    fetch(
        'https://api.moneyonchain.com/api/calculated/moc_last_block_performance'
    ).then(async (response) => {
        const data = await response.json();
        setPercent(data.annualized_value.toFixed(2));
    });
    return (
        <div className="ChartContainer">
            <div className="ChartText">
                <Col xs={24}>
                    <h1>{percent > 0 && `${percent}%`}</h1>
                    <h4>
                        MoC Staking Annualized Performance
                    </h4>
                </Col>
            </div>
            <div className="ChartGraphic">
                <div className="ChartColumn">
                    <div
                        className="Bar Percent Hidden"
                        style={{ height }}
                    />
                    <div className="Bar">
                        <div>MOC</div>
                    </div>
                </div>
                <div className="ChartColumn">
                    <div className="Bar Percent Gray" style={{ height }} />
                    <div className="Bar">
                        <div>
                            MOC
                            <br />+<br />
                            Staking
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
