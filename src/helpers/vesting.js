import VestingMachine from '../contracts/omoc/VestingMachine.json';

const loadVestingAddressesFromLocalStorage = (accountAddress) => {
    const storageVestingAddresses =
        localStorage.getItem(`vesting-addresses-${accountAddress}`);
    let vestingAddresses = [];
    if (storageVestingAddresses !== null) {
        vestingAddresses = JSON.parse(storageVestingAddresses);
    }
    return vestingAddresses;
};

const saveVestingAddressesToLocalStorage = (accountAddress, vAddresses) => {
    // Store vesting addresses
    const sVestingAddresses = JSON.stringify(vAddresses);
    // save to storage addresses
    localStorage.setItem(`vesting-addresses-${accountAddress}`, sVestingAddresses);
};

const saveDefaultVestingToLocalStorage = (accountAddress, vAddress) => {
    // Save as the default vesting also
    localStorage.setItem(`default-vesting-address-${accountAddress}`, vAddress);
};

const loadVesting = async (auth, vAddress) => {

    let loaded = false;
    try {
        const vestingMachine = new auth.web3.eth.Contract(
            VestingMachine.abi,
            vAddress
        );
        const holder = await vestingMachine.methods.getHolder().call();
        console.log(`Loaded Vesting Machine: ${vAddress} Holder: ${holder} `);
        window.dContracts.contracts.VestingMachine = vestingMachine
        loaded = true;

        auth.loadContractsStatusAndUserBalance().then(
            (value) => {
                console.log('Refresh user balance OK!');
            }
        );

    } catch (error) {
        console.log(`Invalid Vesting address: ${error}`);
    }

    return loaded;
}

const onValidateVestingAddress = async (auth, addVestingAddress) => {

    // 1. Input address valid
    if (addVestingAddress === '') {
        return false;
    } else if (
        addVestingAddress.length < 42 ||
        addVestingAddress.length > 42
    ) {
        return false;
    }

    try {
        const vestingMachine = new auth.web3.eth.Contract(
            VestingMachine.abi,
            addVestingAddress
        );
        const holder = await vestingMachine.methods.getHolder().call();
        console.log('Holder: ', holder);

        return true;
    } catch (error) {
        console.log(`Invalid Vesting address: ${error}`);
        return false;
    }
};

export {
    loadVestingAddressesFromLocalStorage,
    saveVestingAddressesToLocalStorage,
    saveDefaultVestingToLocalStorage,
    loadVesting,
    onValidateVestingAddress
};
