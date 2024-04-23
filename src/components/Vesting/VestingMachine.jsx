import { useProjectTranslation } from '../../helpers/translations';
import { Col, Row } from 'antd';

const VestingMachine = () => {
    const [t] = useProjectTranslation();

    return (
        <div className="card-vm">
            <div className="title">
                <h1>{t('vesting.vestingMachineGeneral.title')}</h1>
            </div>
            <Row gutter={16}>
                <Col span={12}>
                    <div className="amount">0.00000000000</div>
                    <div className="label">Vested</div>
                </Col>
                <Col span={12}>
                    <div className="amount"> 0.00000000000</div>
                    <div className="label">total moc</div>
                </Col>
            </Row>
            {/* Fila 2 */}
            <Row gutter={16}>
                <Col span={12}>
                    <div className="amount">0.00000000000</div>
                    <div className="label">vested tokens in staking</div>
                </Col>
                <Col span={12}>
                    <div className="amount">0.00000000000</div>
                    <div className="label">moc ready to withdraw</div>
                </Col>
            </Row>
            {/* Fila 3 */}
            <Row gutter={16}>
                <Col span={12}>
                    <div className="amount">0.00000000000</div>
                    <div className="label">free moc in vesting machine</div>
                </Col>
                <Col span={12}>
                    <div className="withdraw">
                        <button>Withdraw to my wallet </button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default VestingMachine;
