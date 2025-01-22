import React, { useContext, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { notification, Switch, Select, Input } from "antd";

import { useProjectTranslation } from "../../helpers/translations";
import { AuthenticateContext } from "../../context/Auth";
import {
    loadVestingAddressesFromLocalStorage,
    saveVestingAddressesToLocalStorage,
    saveDefaultVestingToLocalStorage,
    loadVesting,
    loadDefaultVestingFromLocalStorage,
} from "../../helpers/vesting";

import VestingMachine from "../../contracts/omoc/VestingMachine.json";
import { withSuccess } from "antd/lib/modal/confirm";
import settings from "../../settings/settings.json";

const { Option } = Select;

function removeAllItem(arr, value) {
    let i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

export default function AccountDialog(props) {
    const { onCloseModal, truncatedAddress, vestingOn, setVestingOn } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [qrValue, setQrValue] = useState(null);
    const [actionVesting, setActionVesting] = useState("select");
    const [addVestingAddress, setAddVestingAddress] = useState("");
    const [addVestingAddressError, setAddVestingAddressError] = useState(false);
    const [addVestingAddressErrorText, setAddVestingAddressErrorText] =
        useState("");

    const defaultVestingAddresses = loadVestingAddressesFromLocalStorage(
        auth.accountData.Wallet
    );
    let defaultVestingAddress = loadDefaultVestingFromLocalStorage(
        auth.accountData.Wallet
    );

    //let defaultVestingAddress = null;
    // Select the first one from the list of vesting if not default vesting address
    if (defaultVestingAddresses && !defaultVestingAddress)
        defaultVestingAddress = defaultVestingAddresses[0];

    const [vestingAddresses, setVestingAddresses] = useState(
        defaultVestingAddresses
    );
    const [vestingAddressDefault, setVestingAddressDefault] = useState(
        defaultVestingAddress
    );

    useEffect(() => {
        onVestingOn();
    }, [vestingOn]);

    useEffect(() => {
        const url =
            process.env.REACT_APP_ENVIRONMENT_EXPLORER_URL +
            "/address/" +
            auth.accountData.Wallet;
        setQrValue(url);
    }, [auth, auth.accountData.Wallet]);

    const onClose = () => {
        onCloseModal();
    };

    const onDisconnect = () => {
        onCloseModal();
        auth.disconnect();
    };

    const onCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(address);
        showNotificationCopiedAddress(address);
    };

    const onCopyVesting = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(vestingAddressDefault);
        showNotificationCopiedAddress(vestingAddressDefault);
    };

    const showNotificationCopiedAddress = (copiedAddress) => {
        notification.open({
            className: "notification type-temporal",
            message: t("feedback.clipboardCopy"),
            description: `${copiedAddress} ` + t("feedback.clipboardTo"),
            placement: "topRight",
            duration: 4,
            pauseOnHover: true,
            onClose: () => {
                // destroys container when closed
                notification.destroy();
            },
        });
    };

    const onChangeInputVestingAddress = (e) => {
        setAddVestingAddress(e.target.value.toLowerCase());
        onValidateVestingAddressClear();
    };

    const onValidateVestingAddressClear = () => {
        setAddVestingAddressErrorText("");
        setAddVestingAddressError(false);
    };

    const onValidateVestingAddress = async () => {
        // 1. Input address valid
        if (addVestingAddress === "") {
            setAddVestingAddressErrorText("Vesting address can not be empty");
            setAddVestingAddressError(true);
            return false;
        } else if (
            addVestingAddress.length < 42 ||
            addVestingAddress.length > 42
        ) {
            setAddVestingAddressErrorText("Not valid input vesting address");
            setAddVestingAddressError(true);
            return false;
        }

        // 2. Check if not in the list
        const vestingLowerCase = vestingAddresses.map(function (value) {
            return value.toLowerCase();
        });
        if (vestingLowerCase.includes(addVestingAddress.toLowerCase())) {
            setAddVestingAddressErrorText("Address is already added!");
            setAddVestingAddressError(true);
            return false;
        }

        try {
            const vestingMachine = new auth.web3.eth.Contract(
                VestingMachine.abi,
                addVestingAddress
            );
            const holder = await vestingMachine.methods.getHolder().call();
            console.log("Holder: ", holder);

            return true;
        } catch (error) {
            console.log(`Invalid Vesting address: ${error}`);
            setAddVestingAddressErrorText(
                "Seems that address is not valid vesting"
            );
            setAddVestingAddressError(true);
            return false;
        }
    };

    const addVesting = async () => {
        const isValidVesting = await onValidateVestingAddress();
        if (isValidVesting) {
            const isLoaded = loadVesting(auth, addVestingAddress);
            if (!isLoaded) {
                return;
            }

            //add on storage
            // get vesting addresses
            const vestingFromStorage = loadVestingAddressesFromLocalStorage(
                auth.accountData.Wallet
            );

            //Add the new one to the list
            vestingFromStorage.push(addVestingAddress.toLowerCase());

            // Store vesting addresses
            saveVestingAddressesToLocalStorage(
                auth.accountData.Wallet.toLowerCase(),
                vestingFromStorage
            );
            saveDefaultVestingToLocalStorage(
                auth.accountData.Wallet.toLowerCase(),
                addVestingAddress
            );

            setVestingAddresses(vestingFromStorage);
            setVestingAddressDefault(addVestingAddress);

            // Close add panel
            setActionVesting("select");
        }
    };

    const onAddVesting = (e) => {
        e.stopPropagation();
        addVesting();
    };

    const onUnloadVM = (e) => {
        e.stopPropagation();
        const removeItems = removeAllItem(
            vestingAddresses,
            vestingAddressDefault
        );
        saveVestingAddressesToLocalStorage(
            auth.accountData.Wallet.toLowerCase(),
            removeItems
        );
        setVestingAddressDefault(null);
        setVestingAddresses(removeItems);

        // Disable using vesting machine
        onChangeShowVesting(false);
    };

    const onShowAddVesting = (e) => {
        e.stopPropagation();
        setActionVesting("add");
    };

    const onCloseAddVesting = (e) => {
        e.stopPropagation();
        setActionVesting("select");
    };

    const onChangeSelectVesting = (selectAddress) => {
        if (!selectAddress) return false;
        if (vestingAddressDefault === selectAddress) return false;
        const isLoaded = loadVesting(auth, selectAddress);
        setVestingAddressDefault(selectAddress);
        saveDefaultVestingToLocalStorage(
            auth.accountData.Wallet.toLowerCase(),
            selectAddress
        );

        return isLoaded;
    };

    const onVestingOn = () => {
        let isLoaded = false;
        if (
            vestingOn &&
            window.dContracts.contracts.VestingMachine === undefined
        ) {
            console.log("Vesting Switch: ON");
            // switch On Vesting
            if (vestingAddressDefault) {
                isLoaded = loadVesting(auth, vestingAddressDefault);
            }
        } else if (
            !vestingOn &&
            window.dContracts.contracts.VestingMachine !== undefined
        ) {
            console.log("Vesting Switch: OFF");
            // Disable using vesting machine
            window.dContracts.contracts.VestingMachine = undefined;
            auth.userBalanceData.vestingmachine = undefined;

            // Refresh status
            auth.loadContractsStatusAndUserBalance().then((value) => {
                console.log("Refresh user balance OK!");
            });
        }

        return isLoaded;
    };

    const onChangeShowVesting = (checked) => {
        setVestingOn(checked);
    };

    return (
        <div className="wallet__settings">
            <div className="ant-modal-header">
                <h1>{t("wallet.modalTitle")}</h1>
            </div>
            <div className="ant-modal-body tx-amount-group">
                <div className="address wallet__columns">
                    <div className="tx-id-container">
                        <div className="tx-id-data">
                            <div className="tx-id-label">
                                {t("wallet.userAddress")}
                            </div>
                            <div
                                className="tx-id-address"
                                style={{
                                    cursor: qrValue ? "pointer" : "default",
                                }}
                                onClick={() => {
                                    if (!qrValue) return;
                                    window.open(
                                        qrValue,
                                        "_blank",
                                        "noopener,noreferrer"
                                    );
                                }}
                            >
                                <div className="truncate-address">
                                    {truncatedAddress}
                                </div>
                                <div onClick={onCopy}>
                                    <div className="icon-copy"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="qr">
                        <QRCode
                            size={256}
                            style={{
                                height: "auto",
                                maxWidth: "100%",
                                width: "100%",
                            }}
                            value={qrValue ?? ""}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                </div>
            </div>

            {settings.project !== "roc" && (
                <div className="switch switch__vesting">
                    <Switch
                        checked={vestingOn}
                        onChange={onChangeShowVesting}
                    />
                    <p>{t("wallet.useVesting")}</p>
                </div>
            )}

            {vestingOn && actionVesting === "select" && (
                <div className="wallet__vesting__options">
                    <div className="wallet__vesting__address__label">
                        {t("wallet.inputLabel")}
                    </div>
                    <div className="wallet__vesting__address__dropdown">
                        <Select
                            className="wallet__vesting__address__selector"
                            onChange={onChangeSelectVesting}
                            value={vestingAddressDefault}
                        >
                            {vestingAddresses.map((possibleOption) => (
                                <Option
                                    key={possibleOption}
                                    value={possibleOption}
                                >
                                    {possibleOption}
                                </Option>
                            ))}
                        </Select>
                        {/* <Button
                            className="address__copy__button"
                            onClick={onCopy}
                        > */}
                        <div
                            className="icon-copy"
                            onClick={onCopyVesting}
                        ></div>
                        {/* </Button> */}
                    </div>
                    <div className="wallet__vesting__options__cta">
                        <div className="wallet__vesting__options__buttons">
                            <button
                                className="button secondary button__small"
                                onClick={onShowAddVesting}
                            >
                                {t("wallet.loadVM")}
                            </button>
                            <button
                                className="button secondary button__small"
                                onClick={onUnloadVM}
                            >
                                {t("wallet.unloadVM")}
                            </button>
                        </div>{" "}
                        <div className="wallet__vesting__options__explanation">
                            {t("wallet.disclaimer")}
                        </div>{" "}
                    </div>
                </div>
            )}
            {vestingOn && actionVesting === "add" && (
                <div className="wallet__vesting__options">
                    <div className=".wallet__vesting__address__label">
                        Add Vesting
                    </div>
                    <div className="wallet__vesting__address__dropdown">
                        <Input
                            type="text"
                            placeholder="vesting address"
                            className="wallet__vesting__address__input"
                            onChange={onChangeInputVestingAddress}
                        />
                        {addVestingAddressError &&
                            addVestingAddressErrorText !== "" && (
                                <div className={"input-error"}>
                                    {addVestingAddressErrorText}
                                </div>
                            )}
                    </div>
                    <div className="wallet__vesting__options__buttons">
                        <button
                            type="secondary"
                            className="button secondary button__small btn-clear"
                            onClick={onCloseAddVesting}
                        >
                            Cancel
                        </button>
                        <button
                            type="primary"
                            className="button secondary button__small btn-confirm"
                            onClick={onAddVesting}
                        >
                            Add
                        </button>
                    </div>
                    <div className="additional-text">
                        {t("wallet.disclaimer")}
                    </div>
                </div>
            )}
            <div className="cta-container">
                <div className="cta-options-group">
                    <button
                        type="secondary"
                        className="button secondary btn-clear"
                        onClick={onDisconnect}
                    >
                        {t("wallet.cta.disconnect")}
                    </button>
                    <button
                        type="primary"
                        className="button btn-confirm"
                        onClick={onClose}
                    >
                        {t("wallet.cta.close")}
                    </button>
                </div>
            </div>
        </div>
    );
}
