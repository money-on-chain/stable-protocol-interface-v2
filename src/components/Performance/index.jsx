import React, { useContext, useState, useEffect } from 'react';
import { Col, Row } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';

export default function Performance(props) {

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);


    return (
        <div className="Performance">

            <Row gutter={24} className="row-section">
                <Col span={12}>

                    <div className="card-system-status">

                        <div className="title">
                            <h1>System Status</h1>
                        </div>

                        <div className="card-content">

                            <div className="coll-1">
                                <div className="stat-text">The system is in optimal condition</div>
                                <div className="detailed-view"> <a href="#">See detailed view</a></div>
                            </div>
                            <div className="coll-2">

                                <div className="stat-icon"> <i className="icon-status-success display-block"></i> Fully Operational</div>
                                <div className="block-info">Showing block 45830394</div>

                            </div>

                        </div>

                    </div>

                </Col>
                <Col span={12}>
                    <div className="card-tvl">

                        <div className="title">
                            <h1>Total Value Lock</h1>
                        </div>

                        <div className="card-content">

                            <div className="big-number">
                                15,875,632.12
                            </div>

                            <div className="caption">
                                Expressed in USD
                            </div>

                        </div>



                    </div>

                </Col>
            </Row>

            <Row gutter={24} className="row-section">
                <Col span={12}>

                    <div className="card-tc">

                        <div className="title">
                            <h1><i className="icon-token-tc display-block"></i> Go Turbo</h1>
                        </div>

                        <div className="card-content">

                            <div className="row-1">
                                <div className="coll-1">
                                    <div className="amount">0.000000000000</div>
                                    <div className="caption"> Price in USD</div>
                                </div>
                                <div className="coll-2">
                                    <div className="amount">0.000000000000</div>
                                    <div className="caption"> Current Leverage</div>
                                </div>
                            </div>

                            <div className="row-2">

                                <div className="coll-1">
                                    <div className="amount">0.000000000000</div>
                                    <div className="caption"> Total in the system</div>
                                </div>
                                <div className="coll-2">
                                    <div className="amount">0.000000000000</div>
                                    <div className="caption"> Available to redeem</div>
                                </div>

                            </div>


                        </div>

                    </div>

                </Col>

                <Col span={12}>

                    <div className="card-collateral">

                        <div className="title">
                            <h1>Collateral</h1>
                        </div>

                        <div className="card-content">

                            <div className="row-1">

                                <div className="coll-1">
                                    <div className="amount">15,875,632.12</div>
                                    <div className="caption">Total Collateral in RBTC</div>
                                </div>
                                <div className="coll-2">
                                    <div className="amount">0.000000000000</div>
                                    <div className="caption">Target coverage (CtargemaCA)</div>
                                </div>

                            </div>

                            <div className="row-2">

                                <div className="list-tokens">

                                    <div className="row-token">

                                        <div className="coll-1">
                                            <div className="token"> <i className="icon-token-ca_0 display-block"></i> Dollar On Chain (DOC)</div>
                                        </div>
                                        <div className="coll-2">
                                            <div className="amount-token">0.000000000000</div>
                                        </div>

                                    </div>

                                    <div className="row-token">

                                        <div className="coll-1">
                                            <div className="token"> <i className="icon-token-ca_1 display-block"></i> RIF On Chain (DOC)</div>
                                        </div>
                                        <div className="coll-2">
                                            <div className="amount-token">0.000000000000</div>
                                        </div>

                                    </div>


                                </div>


                            </div>

                        </div>


                    </div>

                </Col>
            </Row>

            <Row gutter={24} className="row-section">
                <Col span={12}>
                    <div className="card-tps">

                        <div className="title">
                            <h1>Tokens pegged</h1>
                        </div>

                        <div className="card-content">

                            <div className="row-1">

                                <div className="coll-1">
                                    <div className="amount">15,875,632.12</div>
                                    <div className="caption">Total pegged in USD</div>
                                </div>

                            </div>

                            <div className="row-2">

                                <div className="list-tokens">

                                    <div className="row-token">

                                        <div className="coll-1">
                                            <div className="token"> <i className="icon-token-tp_0 display-block"></i> Peso Argentino (FARS)</div>
                                        </div>
                                        <div className="coll-2">
                                            <div className="amount-token">0.000000000000</div>
                                        </div>

                                    </div>

                                    <div className="row-token">

                                        <div className="coll-1">
                                            <div className="token"> <i className="icon-token-tp_1 display-block"></i> Peso Mexicano (FMXN)</div>
                                        </div>
                                        <div className="coll-2">
                                            <div className="amount-token">0.000000000000</div>
                                        </div>

                                    </div>

                                </div>

                            </div>


                        </div>

                    </div>


                </Col>

                <Col span={12}>
                </Col>
            </Row>



        </div>
    );
}
