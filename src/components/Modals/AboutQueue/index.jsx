import React, { useContext, useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';

import { useProjectTranslation } from '../../../helpers/translations';

export default function AboutQueue(props) {
    const { truncatedAddress } = props;

    const [t, i18n, ns] = useProjectTranslation();

    function setStatusIcon(status) {
        switch (status) {
            case t('operations.actions.statusQueuing'):
                return 'QUEUING';
            case t('operations.actions.statusQueued'):
                return 'QUEUED';
            case t('operations.actions.statusConfirming'):
                return 'CONFIRMING';
            case t('operations.actions.statusConfirmed'):
                return 'CONFIRMED';
            case t('operations.actions.statusFailed'):
                return 'FAILED';
        }
    }
    return (
        <div className="queue-modal-container">
            <div className="row">
                <div className="text">{t('operations.modal.queuing')}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={`tx-status-icon-${setStatusIcon(t('operations.actions.statusQueuing'))}`} />
                    <span className={`table-status-icon`}>{t('operations.actions.statusQueuing')}</span>
                </div>
            </div>
            <div className="row">
                <div className="text">{t('operations.modal.queued')}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={`tx-status-icon-${setStatusIcon(t('operations.actions.statusQueued'))}`} />
                    <span className={`table-status-icon`}>{t('operations.actions.statusQueued')}</span>
                </div>
            </div>
            <div className="row">
                <div className="text">{t('operations.modal.confirming')}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={`tx-status-icon-${setStatusIcon(t('operations.actions.statusConfirming'))}`} />
                    <span className={`table-status-icon`}>{t('operations.actions.statusConfirming')}</span>
                </div>
            </div>
            <div className="row">
                <div className="text">{t('operations.modal.confirmed')}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={`tx-status-icon-${setStatusIcon(t('operations.actions.statusConfirmed'))}`} />
                    <span className={`table-status-icon`}>{t('operations.actions.statusConfirmed')}</span>
                </div>
            </div>
            <div className="row">
                <div className="text">{t('operations.modal.failed')}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={`tx-status-icon-${setStatusIcon(t('operations.actions.statusFailed'))}`} />
                    <span className={`table-status-icon table-status-icon-red`}>{t('operations.actions.statusFailed')}</span>
                </div>
            </div>
        </div>
    );
}
