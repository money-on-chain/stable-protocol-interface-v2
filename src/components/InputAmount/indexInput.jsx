import React, { useState, useRef, useEffect } from 'react';
import { useProjectTranslation } from '../../helpers/translations';

const InputAmount = (props) => {
    const [t, i18n, ns] = useProjectTranslation();

    const inputRef = useRef(null);
    const [value, setValue] = useState('');
    const { balanceText, action, balance, placeholder, inputValue, onValueChange, setAddTotalAvailable, validateError } = props;

    useEffect(() => {
        const handleWheel = (event) => {
            console.log('Wheel event triggered');
            event.preventDefault();
        };

        const inputElement = inputRef.current;
        if (inputElement) {
            inputElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (inputElement) {
                inputElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    const isValidNumber = (value) => {
        const num = value.replace(',', '.');
        return !isNaN(num);
    };

    const handleValueChange = (value) => {
        let formattedValue = value;
        if (value.length > 20) {
            return;
        }
        if (value.startsWith('.')) {
            formattedValue = `0${value}`;
        }

        if (formattedValue === '') {
            if (formattedValue.includes(',')) {
                formattedValue = formattedValue.replace(/,/g, '');
                onValueChange(formattedValue);
            } else {
                onValueChange('');
            }
        } else if (isValidNumber(formattedValue)) {
            onValueChange(formattedValue.replace(',', '.'));
        } else {
            onValueChange('');
        }
    };
    return (
        <div className="input-amount-containerOLD amountInput">
            <div className="title-balance-containerOLD amountInput__infoBar">
                <div className="input-titleOLD amountInput__label">{action}</div>
                <span className="input-balanceOLD amountInput__available">
                    {`${balanceText}: `}
                    {balance}
                </span>
            </div>
            <div className="input-field-containerOLD amountInput__amount">
                <input
                    ref={inputRef}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(event) => {
                        handleValueChange(event.target.value);
                    }}
                    className={`input-valueOLD amountInput__value ${validateError ? 'input-value-errorOLD amountInput__feedback--error' : ''}`}
                    type={'number'}
                />
                <button className="max-buttonOLD amountInput__maxButton" onClick={setAddTotalAvailable}>
                    {t('button.inputMaxValue')}
                </button>
            </div>
        </div>
    );
};

export default InputAmount;
