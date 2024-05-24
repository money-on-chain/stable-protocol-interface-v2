import React, { useState, useRef, useEffect} from 'react'

const InputAmount = (props) => {
  const inputRef = useRef(null);  
  const [value, setValue] = useState('');
  const {
    balanceText,
    action,
    balance,
    placeholder,
    inputValue,
    onValueChange,
    setAddTotalAvailable,
    validateError,
  } = props;

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
  }

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
    <div className="input-amount-container">
      <div className="title-balance-container">
        <div className="input-title">{action}</div>
        <span className="input-balance">
          {`${balanceText}: `}
          {balance}
        </span>
      </div>
      <div className="input-field-container">
        <input
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={(event) => {
            handleValueChange(event.target.value)
          }}
          className={`input-value ${validateError ? 'input-value-error' : ''}`}
          type={'number'}
        />
        <button className="max-button" onClick={setAddTotalAvailable}>
          MAX
        </button>
      </div>
    </div>
  )
}

export default InputAmount
