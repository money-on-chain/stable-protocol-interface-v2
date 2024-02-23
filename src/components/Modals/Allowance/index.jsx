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
                open={visible}
                onCancel={onHideModalAllowance}
                footer={null}
                closable={false}
                className="ModalAllowance"
                centered={true}
                maskClosable={false}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', backdropFilter: 'blur(2px)' }}
            >
                <Allowance {...props} onCloseModal={onHideModalAllowance} />
            </Modal>
        </div>
    );
}
