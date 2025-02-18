import React from "react";
import PropTypes from "prop-types";

import { useProjectTranslation } from "../../../helpers/translations";
import "./Styles.scss";

function ItemData(props) {
    return (
        <div className="LastOp__expanded__item">
            <div className="LastOp__expanded__label">{props.label}</div>
            <div className="LastOp__expanded__data">{props.data}</div>
        </div>
    );
}

function RowDetail(props) {
    const { t, ns } = useProjectTranslation();

    return (
        <div className="LastOp__expanded__container">
            <ItemData
                label={t(`operations.columns_detailed.event`, { ns: ns })}
                data={props.detail.event}
            />
            <ItemData
                label={t(`operations.columns_detailed.created`, { ns: ns })}
                data={props.detail.created}
            />
            <ItemData
                label={t(`operations.columns_detailed.gas_used`, { ns: ns })}
                data={props.detail.gas_used}
            />
            <ItemData
                label={t(`operations.columns_detailed.oper_id`, { ns: ns })}
                data={props.detail.oper_id}
            />
            <ItemData
                label={t(`operations.columns_detailed.confirmation`, {
                    ns: ns,
                })}
                data={props.detail.confirmation}
            />
            <ItemData
                label={t(`operations.columns_detailed.recipient`, {
                    ns: ns,
                })}
                data={props.detail.recipient}
            />
            <ItemData
                label={t(`operations.columns_detailed.status`, {
                    ns: ns,
                })}
                data={props.detail.status}
            />
            <ItemData
                label={t(`operations.columns_detailed.error_code`, {
                    ns: ns,
                })}
                data={props.detail.error_code}
            />
            <ItemData
                label={t(`operations.columns_detailed.block`, {
                    ns: ns,
                })}
                data={props.detail.block}
            />
            <ItemData
                label={t(`operations.columns_detailed.executed_tx`, {
                    ns: ns,
                })}
                data={
                    <a
                        className="ant-descriptions-a"
                        href={`${import.meta.env.REACT_APP_ENVIRONMENT_EXPLORER_URL}/tx/${props.detail.executed_tx_hash}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span>{props.detail.executed_tx_hash_truncate} </span>
                    </a>
                }
            />
            <ItemData
                label={t(`operations.columns_detailed.fee`, {
                    ns: ns,
                })}
                data={props.detail.fee}
            />
            <ItemData
                label={t(`operations.columns_detailed.tx`, {
                    ns: ns,
                })}
                data={
                    <a
                        className="ant-descriptions-a"
                        href={`${import.meta.env.REACT_APP_ENVIRONMENT_EXPLORER_URL}/tx/${props.detail.tx_hash}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span>{props.detail.tx_hash_truncate} </span>
                    </a>
                }
            />
            <ItemData
                label={t(`operations.columns_detailed.msg`, {
                    ns: ns,
                })}
                data={props.detail.msg}
            />
            <ItemData
                label={t(`operations.columns_detailed.reason`, {
                    ns: ns,
                })}
                data={props.detail.reason}
            />
        </div>
    );
}

export default RowDetail;

RowDetail.propTypes = {
    detail: PropTypes.object,
};

ItemData.propTypes = {
    label: PropTypes.string,
    data: PropTypes.object,
};
