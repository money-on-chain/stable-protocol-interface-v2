import React, { useContext, useState } from "react";
import { Modal, Button } from "antd";
import { getCurrenciesDetail } from "../../helpers/currencies";
import { AuthenticateContext } from "../../context/Auth";
import { useProjectTranslation } from "../../helpers/translations";
import "./Styles.scss";

export default function CurrencyPopUp(props) {
    const { value, onChange, currencyOptions, disabled, action, title } = props;
    const [t, i18n, ns] = useProjectTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Retrieve currency options with details
    const options = getCurrenciesDetail().map((currency) => ({
        value: currency.value,
        image: currency.image,
        label: t(`${action}.tokens.${currency.value}.label`, { ns: ns }),
        abbreviation: t(`${action}.tokens.${currency.value}.abbr`, { ns: ns }),
    }));

    // Get the currently selected currency
    const selectedCurrency = options.find(
        (currency) => currency.value === value
    );

    // Filter options to only include allowed currencies
    const filteredOptions = options.filter((currency) =>
        currencyOptions.includes(currency.value)
    );

    const auth = useContext(AuthenticateContext);

    // Function to open the modal
    const openModal = () => {
        if (!disabled) {
            setIsModalVisible(true);
        }
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalVisible(false);
    };

    // Function to select a currency and close the modal
    const handleSelect = (selectedValue) => {
        onChange(selectedValue);
        closeModal();
    };

    return (
        <div className={`SelectCurrency ${disabled ? "disabled" : ""}`}>
            {/* Button or selected currency to open the modal */}
            <div className={`${action}-select-token`} onClick={openModal}>
                {selectedCurrency ? (
                    <div className="selected-token">
                        <div className="token__icon">
                            {selectedCurrency.image}
                        </div>
                        <div className="token__name">
                            {selectedCurrency.label}
                        </div>
                        <div className="token__ticker">{`(${selectedCurrency.abbreviation})`}</div>
                        <div className="icon__toggle__expand"></div>
                    </div>
                ) : (
                    <Button type="primary" disabled={disabled}>
                        Select Token
                    </Button>
                )}
            </div>

            {/* Ant Design Modal */}
            <Modal
                title={title && title.trim() !== "" ? title : "Select a Token"} // Custom title support
                visible={isModalVisible}
                onCancel={closeModal}
                footer={null}
                centered
            >
                <div className="token-list">
                    {filteredOptions.map((currency) => (
                        <div
                            key={currency.value}
                            className={`token-item ${currency.value === value ? "is-selected" : ""}`}
                            onClick={() => handleSelect(currency.value)}
                        >
                            <div className="token__icon">{currency.image}</div>
                            <div className="token__name">{currency.label}</div>
                            <div className="token__ticker">{`(${currency.abbreviation})`}</div>
                            {/* Show checkmark icon only if this is the selected token */}
                            {currency.value === value && (
                                <div className="icon__selected selected-icon"></div>
                            )}
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}
