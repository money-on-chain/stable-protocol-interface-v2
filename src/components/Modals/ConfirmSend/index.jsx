import React, { useState } from "react";
import Modal from "antd/lib/modal/Modal";
import PropTypes from "prop-types";

import { useProjectTranslation } from "../../../helpers/translations";
import ConfirmSend from "../../ConfirmSend";
import { Button } from "antd";

export default function ModalConfirmSend(props) {
    const { /*onClear,*/ inputValidationError } = props;

    const { t } = useProjectTranslation();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    return (
        <div className="ShowModalConfirmOperation">
            <Button
                type="primary"
                className={
                    import.meta.env.REACT_APP_ENVIRONMENT_APP_PROJECT.toLowerCase()
                        ? "button"
                        : "button"
                }
                onClick={showModal}
                disabled={inputValidationError ? "disabled" : null}
            >
                {t("send.buttonPrimary")}
            </Button>
            {visible && (
                <Modal
                    title={t("send.modalTitle")}
                    width={505}
                    open={visible}
                    onCancel={hideModal}
                    footer={null}
                    className="ModalConfirmOperation"
                    closable={false}
                    centered={true}
                    maskClosable={false}
                    maskStyle={{}}
                >
                    <ConfirmSend {...props} onCloseModal={hideModal} />
                </Modal>
            )}
        </div>
    );
}

ModalConfirmSend.propTypes = {
    inputValidationError: PropTypes.bool,
};
