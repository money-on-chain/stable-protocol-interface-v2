import React, { useContext, useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { notification, Switch, Select, Button, Input } from 'antd';

import { useProjectTranslation } from '../../helpers/translations';
import { AuthenticateContext } from '../../context/Auth';
import BigNumber from 'bignumber.js';
import VestingMachine from '../../contracts/omoc/VestingMachine.json';


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
    const { onCloseModal, truncatedAddress, vestingOn } = props;

    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);
    const [qrValue, setQrValue] = useState(null);
    const [showVesting, setShowVesting] = useState(vestingOn);
    const [actionVesting, setActionVesting] = useState('select');
    const [addVestingAddress, setAddVestingAddress] = useState('');
    const [addVestingAddressError, setAddVestingAddressError] = useState(false);
    const [addVestingAddressErrorText, setAddVestingAddressErrorText] = useState('');

    const loadVestingAddressesFromLocalStorage = () => {
        const storageVestingAddresses = localStorage.getItem("vesting-addresses");
        let vestingAddresses = []
        if(storageVestingAddresses !== null){
            vestingAddresses = JSON.parse(storageVestingAddresses)
        }
        return vestingAddresses
    };

    const defaultVestingAddresses = loadVestingAddressesFromLocalStorage();
    let defaultVestingAddress = null
    // Select the first one from the list of vesting
    if (defaultVestingAddresses) defaultVestingAddress = defaultVestingAddresses[0]

    const [vestingAddresses, setVestingAddresses] = useState(defaultVestingAddresses);
    const [vestingAddressDefault, setVestingAddressDefault] = useState(defaultVestingAddress);

    useEffect(() => {
        const url = process.env.REACT_APP_ENVIRONMENT_EXPLORER_URL + '/address/' + auth.accountData.Wallet;
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
        notification.open({
            message: t('feedback.clipboardCopy'),
            description: `${address} ` + t('feedback.clipboardTo'),
            placement: 'bottomRight'
        });
    };

    const onChangeInputVestingAddress = (e) => {
        setAddVestingAddress(e.target.value);
        onValidateVestingAddressClear();
    };

    const onValidateVestingAddressClear = () => {
        setAddVestingAddressErrorText('');
        setAddVestingAddressError(false);
    };

    const onValidateVestingAddress = () => {

        // 1. Input address valid
        if (addVestingAddress === '') {
            setAddVestingAddressErrorText('Vesting address can not be empty');
            setAddVestingAddressError(true);
            return false;
        } else if (addVestingAddress.length < 42 || addVestingAddress.length > 42) {
            setAddVestingAddressErrorText('Not valid input vesting address');
            setAddVestingAddressError(true);
            return false
        }

        // 2. Check if not in the list
        /*const vestingLowerCase = vestingAddresses.map(function(value){return value.toLowerCase()});
        if (vestingLowerCase.includes(addVestingAddress)) {
            setAddVestingAddressErrorText('Address is already added!');
            setAddVestingAddressError(true);
            return false
        }*/

        try {
            const vestingMachine = new auth.web3.eth.Contract(
                VestingMachine.abi,
                addVestingAddress
            );
            const holder = vestingMachine.methods.getHolder().call()
            console.log("Holder: ", holder);

            return true
        } catch (error) {
            console.log(`Invalid Vesting address: ${error}`);
            setAddVestingAddressErrorText('Seems that address is not valid vesting');
            setAddVestingAddressError(true);
            return false
        }
    };

    const saveVestingAddressesToLocalStorage = (vAddresses) => {

        // Store vesting addresses
        const sVestingAddresses =
            JSON.stringify(vAddresses)

        // save to storage addresses
        localStorage.setItem(
            "vesting-addresses",
            sVestingAddresses
        )

    }

    const saveDefaultVestingToLocalStorage = (vAddress) => {

        // Save as the default vesting also
        localStorage.setItem(
            "default-vesting-address",
            vAddress
        )

    }

    const onAddVesting = (e) => {
        e.stopPropagation();
        const isValidVesting = onValidateVestingAddress();
        if (isValidVesting) {
            //add on storage

            // get vesting addresses
            const vestingAddresses = loadVestingAddressesFromLocalStorage()

            //Add the new one to the list
            vestingAddresses.push(addVestingAddress)

            // Store vesting addresses
            saveVestingAddressesToLocalStorage(vestingAddresses)
            saveDefaultVestingToLocalStorage(addVestingAddress)

            setVestingAddresses(vestingAddresses)
            setVestingAddressDefault(addVestingAddress)

            // Close add panel
            setActionVesting('select');
        }

    };

    const onUnloadVM = (e) => {
        e.stopPropagation();
        const removeItems = removeAllItem(vestingAddresses, vestingAddressDefault);
        saveVestingAddressesToLocalStorage(removeItems);
        setVestingAddressDefault(null);
        setVestingAddresses(removeItems);
        console.log("DEBUG>>>")
        console.log(removeItems)
    };

    const onShowAddVesting = (e) => {
        e.stopPropagation();
        setActionVesting('add');
    };

    const onCloseAddVesting = (e) => {
        e.stopPropagation();
        setActionVesting('select');
    };

    return (
        <div className="AccountDialog">
            <div className="title">{t('wallet.modalTitle')}</div>
            <div className="address">
                <div
                    style={{ cursor: qrValue ? 'pointer' : 'default' }}
                    onClick={() => {
                        if (!qrValue) return;
                        window.open(qrValue, '_blank', 'noopener,noreferrer');
                    }}
                >
                    <div className="address-info">
                        <div className="caption">{t('wallet.userAddress')}</div> <div className="truncate-address">{truncatedAddress}</div>
                        <div className="address-actions">
                            <a onClick={onCopy}>
                                <i className="icon-copy"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="qr">
                    <QRCode size={256} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={qrValue ?? ''} viewBox={`0 0 256 256`} />
                </div>
            </div>

            <div className="switch">
                <Switch checked={showVesting} onChange={(checked) => setShowVesting(checked)} />
                <p>{t('wallet.useVesting')}</p>
            </div>

            {showVesting && actionVesting === 'select' && (
                <div className="additional-content">
                    <div className="dropdown-label">{t('wallet.inputLabel')}</div>
                    <div className="dropdown">
                        <Select value={vestingAddressDefault} style={{ width: 120 }}>
                            {vestingAddresses.map((possibleOption) => (
                                <Option
                                    key={possibleOption}
                                    value={possibleOption}
                                >
                                    {possibleOption}
                                </Option>
                            ))}
                        </Select>
                        <Button onClick={onCopy}>
                            <i className="icon-copy"></i>
                        </Button>
                    </div>
                    <div className="buttons">
                        <button onClick={onShowAddVesting}>{t('wallet.loadVM')}</button>
                        <button onClick={onUnloadVM}>{t('wallet.unloadVM')}</button>
                    </div>
                    <div className="additional-text">{t('wallet.disclaimer')}</div>
                </div>
            )}

            {showVesting && actionVesting === 'add' && (
                <div className="additional-content">
                    <div className="dropdown-label">Add Vesting</div>
                    <div className="dropdown">
                        <Input type="text" placeholder="vesting address" className="input-address" onChange={onChangeInputVestingAddress} />
                        {addVestingAddressError && addVestingAddressErrorText !== '' && (<div className={'input-error'}>{addVestingAddressErrorText}</div>)}
                    </div>
                    <div className="actions">
                        <button type="secondary" className="secondary-button btn-clear" onClick={onCloseAddVesting}>
                            Cancel
                        </button>
                        <button type="primary" className="primary-button btn-confirm" onClick={onAddVesting}>
                            Add
                        </button>
                    </div>
                    <div className="additional-text">{t('wallet.disclaimer')}</div>
                </div>
            )}



            <div className="actions">
                <button type="secondary" className="secondary-button btn-clear" onClick={onDisconnect}>
                    {t('wallet.cta.disconnect')}
                </button>
                <button type="primary" className="primary-button btn-confirm" onClick={onClose}>
                    {t('wallet.cta.close')}
                </button>
            </div>
        </div>
    );
}
