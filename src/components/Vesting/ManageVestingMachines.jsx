import { useProjectTranslation } from '../../helpers/translations';
import { Col, Row, Select } from 'antd';

export default function ManageVestingMachines() {
    const [t] = useProjectTranslation();
    return (
        <div className="card-mvm">
            <div className="title">
                <h1>Manage Vesting Machines</h1>
            </div>
            <Row>
                <Col span={24}>
                    <div className="input-label">select a loaded vesting machine</div>
                </Col>
            </Row>
            <Row style={{ width: '100%' }}>
                <Col span={24}>
                    <Select
                        className="select"
                        defaultValue="1"
                        style={{
                            width: '100%',
                            paddingTop: '5px'
                        }}
                        options={[
                            {
                                value: '1',
                                label: '0x6e55698Ef73171CC8D88b8AdE08a6001B1b9FbcA'
                            }
                        ]}
                    />
                </Col>
            </Row>
            {/* Fila 2 */}
            <Row>
                <div className="btn-wrapper">
                    <button>Load vesting machine</button>
                    <button>Unload vesting machine</button>
                    <button>Use claim code</button>
                </div>
            </Row>
            <Row>
                <p className="disclaimer">
                    You can load any existing Vesting Machine address. Unloading a Vesting Machine address from the App doesn't affect it's funds and
                    it can be re loaded any time. If you have a Claim Code, you can create a new Vesting, Machine.
                </p>
            </Row>
        </div>
    );
}
