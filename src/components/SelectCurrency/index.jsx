import React, { useContext } from 'react';
import { Select } from 'antd';

import { getCurrenciesDetail } from '../../helpers/currencies';
import { AuthenticateContext } from '../../context/Auth';
import { useProjectTranslation } from '../../helpers/translations';

import './style.scss';

const { Option } = Select;

export default function SelectCurrency(props) {
    const { value, onChange, currencyOptions, disabled } = props;
    const [t, i18n, ns] = useProjectTranslation();

    const options = getCurrenciesDetail().map((it) => ({
        value: it.value,
        image: it.image,
        label: t(`exchange.tokens.${it.value}.label`, { ns: ns }),
        abbr : t(`exchange.tokens.${it.value}.abbr`, { ns: ns })
    }));
    const option = options.find((it) => it.value === value);
    const optionsFiltered = options.filter((it) =>
        currencyOptions.includes(it.value)
    );
    const auth = useContext(AuthenticateContext);
    return (
        <div className={`SelectCurrency ${disabled ? 'disabled' : ''}`}>
            <Select
                className="exchange-select-token"
                size={'large'}
                onChange={onChange}
                disabled={disabled}
                value={option && option.value}
            >
                {optionsFiltered.map((possibleOption) => (
                    <Option
                        key={possibleOption.value}
                        value={possibleOption.value}
                    >
                        <div className="currencyOption">
                            {possibleOption.image}
                            {possibleOption.label}
                        </div>
                        <div className="currencyOption-abbr">{`(${possibleOption.abbr})`}</div>
                    </Option>
                ))}
            </Select>
        </div>
    );
}
