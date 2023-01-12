import { DebounceInput } from 'react-debounce-input';
import React, { useContext, useState } from 'react';

import { useProjectTranslation } from '../../../helpers/translations';
import { AuthenticateContext } from '../../../context/Auth';


export default function InputAmount(props) {

    const {
        InputValue,
        placeholder = '',
        validateError = false,
        onValueChange = (newAmount) => {}
    } = props;

    const handleValueChange = newAmount => {
        onValueChange(newAmount);
    };

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    return (<DebounceInput
                placeholder={placeholder}
                value={InputValue}
                debounceTimeout={1000}
                onChange={event => handleValueChange(event.target.value)}
                className={`input-value ${validateError ? 'input-value-error' : ''}`}
                type={"number"}
            />)

}