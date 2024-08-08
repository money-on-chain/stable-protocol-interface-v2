import React, { useContext } from 'react';
import { Select } from 'antd';

import { getCurrenciesDetail } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';

const { Option } = Select;

export default function SelectCurrency(props) {
    const { value, onChange, currencyOptions, disabled, action } = props;
    const [t, i18n, ns] = useProjectTranslation();

    const options = getCurrenciesDetail().map((it) => ({
        value: it.value,
        image: it.image,
        label: t(`${action}.tokens.${it.value}.label`, { ns: ns }),
        abbr: t(`${action}.tokens.${it.value}.abbr`, { ns: ns })
    }));
    const option = options.find((it) => it.value === value);
    const optionsFiltered = options.filter((it) => currencyOptions.includes(it.value));
    const auth = useContext(AuthenticateContext);
    return (
        <div className={`SelectCurrency ${disabled ? 'disabled' : ''}`}>
            <Select className={`${action}-select-token`} size={'large'} onChange={onChange} disabled={disabled} value={option && option.value}>
                {optionsFiltered.map((possibleOption) => (
                    <Option key={possibleOption.value} value={possibleOption.value}>
                        <div className="token">
                            <div className="token__icon">{possibleOption.image}</div>
                            <div className="token__name">{possibleOption.label}</div>
                            <div className="token__ticker">{`(${possibleOption.abbr})`}</div>                        </div>
                    </Option>
                ))}
            </Select>
        </div>
    );
}
