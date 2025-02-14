import React from 'react';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';

import Allowance from '../../Allowance';


export default function ModalAllowanceOperation(props) {
    const { visible, onHideModalAllowance, title } = props;

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
                maskStyle={{  }}
            >
                <Allowance {...props} onCloseModal={onHideModalAllowance} />
            </Modal>
        </div>
    );
}


ModalAllowanceOperation.propTypes = {
    visible: PropTypes.bool,
    onHideModalAllowance: PropTypes.func,
    title: PropTypes.string
};
