import Modal, {Fragment} from 'antd/lib/modal/Modal';
import React from 'react';

import { useProjectTranslation } from '../../../helpers/translations';
import './style.scss';
import CopyAddress from '../../CopyAddress';

const OperationStatusModal = ({
    className,
    visible,
    onCancel,
    title,
    operationStatus,
    txHash
}) => {
    const [t] = useProjectTranslation();

    let sentIcon = '';
    let statusLabel = '';
    switch (operationStatus) {
        case 'sign':
            sentIcon = 'icon-signifier';
            statusLabel = t('staking.modal.StatusModal_Modal_TxStatus_sign');
            break;
        case 'pending':
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = t('staking.modal.StatusModal_Modal_TxStatus_pending');
            break;
        case 'success':
            sentIcon = 'icon-tx-success';
            statusLabel = t('staking.modal.StatusModal_Modal_TxStatus_success');
            break;
        case 'error':
            sentIcon = 'icon-tx-error';
            statusLabel = t('staking.modal.StatusModal_Modal_TxStatus_failed');
            break;
        default:
            sentIcon = 'icon-tx-waiting rotate';
            statusLabel = t('staking.modal.StatusModal_Modal_TxStatus_sign');
    }

    return (
        <Modal
            className={'OperationStatusModal ' + className || ''}
            footer={null}
            open={visible}
            onCancel={onCancel}
        >

            <h1 className={'StakingOptionsModal_Title'}>
                {title || t('staking.modal.StatusModal_Modal_Title')}
            </h1>

            <div className="tx-sent">
                <div className="status">

                    {(operationStatus === 'pending' ||
                        operationStatus === 'success' ) && (

                        <div className="transaction-id">
                            <div className="label">Transaction ID</div>
                            <div className="address-section">
                                <CopyAddress address={txHash} type={'tx'}></CopyAddress>
                                {/*<span className="address">*/}
                                {/*    {truncateTxId(txID)}*/}
                                {/*</span>*/}
                                {/*<i className="icon-copy"></i>*/}
                            </div>
                        </div>

                    )}

                    <div className="tx-logo-status">
                        <i className={sentIcon}></i>
                    </div>

                    <div className="status-label">{statusLabel}</div>

                    <button type="primary" className="secondary-button btn-clear" onClick={onCancel}>
                        {t('staking.modal.StatusModal_Modal_Close')}
                    </button>

                </div>
            </div>


        </Modal>
    );
};

export default OperationStatusModal;
