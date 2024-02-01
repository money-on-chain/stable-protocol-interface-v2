import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from '../../../helpers/translations';
import Allowance from '../../Allowance';

export default function ModalAllowanceOperation(props) {
    const { visible, onHideModalAllowance, title } = props;

    const [t, i18n, ns] = useProjectTranslation();

    return (
        <div className="ShowModalAllowance">
            <Modal
                title={title}
                width={505}
                visible={visible}
                onCancel={onHideModalAllowance}
                footer={null}
                closable={false}
                className="ModalAllowance"
            >
                <Allowance {...props} onCloseModal={onHideModalAllowance} />
            </Modal>
        </div>
    );
}
