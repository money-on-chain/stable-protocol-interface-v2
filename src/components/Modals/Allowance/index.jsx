
import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import {useProjectTranslation} from "../../../helpers/translations";
import Allowance from "../../Allowance";
import {Button} from "antd";


export default function ModalAllowanceOperation(props) {

    const [t, i18n, ns] = useProjectTranslation();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    return (
        <div className="ShowModalAllowance">
            <Button
                type="primary"
                className="btnConfirm"
                onClick={showModal}
            >Allowance</Button>
            <Modal
                title="Authorize allowance"
                width={505}
                visible={visible}
                onCancel={hideModal}
                footer={null}
                className="ModalExchange"
            >
                <Allowance {...props} />
            </Modal>
        </div>
    )
}