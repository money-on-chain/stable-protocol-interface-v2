import React from 'react';
import { useProjectTranslation } from '../../../helpers/translations';

function RowDetail(props) {
    const [t, i18n, ns] = useProjectTranslation();

    return (
        <table>
            <tbody>
                <tr className="ant-descriptions-row">
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.event`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {props.detail.event}{' '}
                    </td>
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.created`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {props.detail.created}
                    </td>
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.detail`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        <div>{props.detail.details} </div>
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.asset`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {props.detail.asset}{' '}
                    </td>
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.confirmation`, {
                            ns: ns
                        })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {props.detail.confirmation}{' '}
                    </td>
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.address`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {props.detail.address}{' '}
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.platform`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {props.detail.platform}
                    </td>
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.platform_fee`, {
                            ns: ns
                        })}
                    </th>
                    <td className="ant-descriptions-item-content" colSpan="1">
                        {props.detail.platform_fee}
                    </td>
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.block`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {props.detail.block}{' '}
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.wallet`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {props.detail.wallet}
                    </td>
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.interests`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        <span>{props.detail.interests} </span>
                    </td>
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.tx`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        <a
                            className="ant-descriptions-a"
                            href={`${process.env.REACT_APP_ENVIRONMENT_EXPLORER_URL}/tx/${props.detail.tx_hash}`}
                            target="_blank"
                        >
                            <span>{props.detail.tx_hash_truncate} </span>
                        </a>
                    </td>
                </tr>
                <tr className="ant-descriptions-row">
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.leverage`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        <span>{props.detail.leverage} </span>
                    </td>
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.gas`, { ns: ns })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {props.detail.gas_fee}
                    </td>
                    <th
                        className="ant-descriptions-item-label-th ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {t(`operations.columns_detailed.reserve_price`, {
                            ns: ns
                        })}
                    </th>
                    <td
                        className="ant-descriptions-item-content ant-descriptions-border-bottom"
                        colSpan="1"
                    >
                        {props.detail.price}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default RowDetail;
