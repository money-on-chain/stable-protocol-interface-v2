import React from 'react';
import { Col, Row } from 'antd';
import VestingMachine from './VestingMachine';
import ManageVestingMachines from './ManageVestingMachines';

const Vesting = (props) => {
    return (
        <div className="Vesting">
            <Row gutter={24} className="row-section">
                <Col span={12}>
                    <VestingMachine />
                </Col>
                <Col span={12}>
                    <ManageVestingMachines />
                </Col>
            </Row>
        </div>
    );
};

export default Vesting;
