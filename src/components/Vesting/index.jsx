import React from 'react'
import { Col, Row } from 'antd';
import { useProjectTranslation } from '../../helpers/translations';
const Vesting = (props) => {
  const [t] = useProjectTranslation();
  const cellData = [
    { saldo: 100, texto: 'Texto 1' },
    { saldo: 200, texto: 'Texto 2' },
    { saldo: 300, texto: 'Texto 3' },
    { saldo: 400, texto: 'Texto 4' },
    { saldo: 500, texto: 'Texto 5' },
    { saldo: 600, texto: 'Texto 6' },
  ];
  return (
    <div className="Vesting">
      <Row gutter={24} className="row-section">
        <Col span={12}>
          <div className="card-row1">
            <div className="title">
              <h1>{t('vesting.vestingMachineGeneral.title')}</h1>
              <h1>{t('vesting.vestingMachineGeneral.title')}</h1>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <div>Saldo 1</div>
                <div>Texto debajo del saldo 1</div>
              </Col>
              <Col span={12}>
                <div>Saldo 2</div>
                <div>Texto debajo del saldo 2</div>
              </Col>
            </Row>
            {/* Fila 2 */}
            <Row gutter={16}>
              <Col span={12}>
                <div>Saldo 3</div>
                <div>Texto debajo del saldo 3</div>
              </Col>
              <Col span={12}>
                <div>Saldo 4</div>
                <div>Texto debajo del saldo 4</div>
              </Col>
            </Row>
            {/* Fila 3 */}
            <Row gutter={16}>
              <Col span={12}>
                <div>Saldo 5</div>
                <div>Texto debajo del saldo 5</div>
              </Col>
              <Col span={12}>
                <div>Saldo 6</div>
                <div>Texto debajo del saldo 6</div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Vesting
