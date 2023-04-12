import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from '../../../helpers/translations';
import Exchange from '../../Exchange';

export default function ModalExchange() {
    const [t, i18n, ns] = useProjectTranslation();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    return (
        <div>
            <a href="#" onClick={showModal} className="menu-nav-item">
                <i className="logo-exchange"></i>{' '}
                <span className="menu-nav-item-title">Exchange</span>
            </a>
            <Modal
                title="Exchange"
                width={670}
                visible={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalExchange"
            >
                <Exchange />
            </Modal>
        </div>
    );
}
