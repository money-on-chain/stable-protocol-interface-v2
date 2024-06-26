import { createContext, useEffect, useState } from 'react';
import getRLogin from '../lib/rLogin';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import addressHelper from '../helpers/addressHelper';

import {
    ApproveTokenContract,
    exchangeMethod,
    TokenContract } from '../helpers/exchange';

import { readContracts } from '../lib/backend/contracts';
import { contractStatus, userBalance } from '../lib/backend/multicall';
import { decodeEvents } from '../lib/backend/transaction';
import {
    AllowanceAmount,
    transferTokenTo,
    MigrateToken,
    AllowUseTokenMigrator } from '../lib/backend/moc-base';

import { getGasPrice } from '../lib/backend/utils';

const helper = addressHelper(Web3);

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const AuthenticateContext = createContext({
    isLoggedIn: false,
    account: null,
    userBalanceData: null,
    contractStatusData: null,
    web3: null,
    connect: () => {},
    interfaceAllowanceAmount: async (
        currencyYouExchange,
        currencyYouReceive,
        amountAllowance,
        onTransaction,
        onReceipt
    ) => {},
    interfaceTransferToken: async (
        currencyYouExchange,
        amount,
        destinationAddress,
        onTransaction,
        onReceipt
    ) => {},
    interfaceExchangeMethod: async (
        currencyYouExchange,
        currencyYouReceive,
        tokenAmount,
        limitAmount,
        onTransaction,
        onReceipt
    ) => {},
    disconnect: () => {},
    getTransactionReceipt: (hash) => {},
    interfaceDecodeEvents: async (receipt) => {},
    getSpendableBalance: async (address) => {},
    loadContractsStatusAndUserBalance: async (address) => {},
    getReserveAllowance: async (address) => {},
    interfaceAllowUseTokenMigrator: async (amount, onTransaction, onReceipt, onError) => {},
    interfaceMigrateToken: async (onTransaction, onReceipt, onError) => {},
});

const AuthenticateProvider = ({ children }) => {
    const [contractStatusData, setContractStatusData] = useState(null);
    const [provider, setProvider] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [account, setAccount] = useState(null);
    const [userBalanceData, setUserBalanceData] = useState(null);
    const [accountData, setAccountData] = useState({
        Wallet: '',
        Owner: '',
        Balance: 0,
        GasPrice: 0,
        truncatedAddress: '0x0000..0000'
    });

    async function loadCss() {
        let css_logout = await import('../assets/css/logout.scss');
    }

    useEffect(() => {
        if (!window.rLogin) {
            window.rLogin = getRLogin(
                process.env.REACT_APP_ENVIRONMENT_CHAIN_ID
            );
            if (window.rLogin.cachedProvider) {
                connect();
            } else {
                connect();
                disableLogin();
            }
        }
    });

    const disableLogin = () => {
        document
            .querySelectorAll('.rlogin-modal-hitbox')[0]
            .addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        loadCss();
    };

    useEffect(() => {
        if (account) {
            initContractsConnection();
            loadAccountData();
        }
    }, [account]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (account) {
                loadContractsStatusAndUserBalance();
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [account]);

    const connect = () =>
        window.rLogin.connect().then((rLoginResponse) => {
            const { provider, disconnect } = rLoginResponse;
            setProvider(provider);

            const web3 = new Web3(provider);
            provider.on('accountsChanged', function (accounts) {
                disconnect();
                window.location.reload();
                /*if ( accounts.length==0 ){
                    disconnect()
                    window.location.reload()
                }*/
            });
            provider.on('chainChanged', function (accounts) {
                disconnect();
                window.location.reload();
            });

            setWeb3(web3);
            window.rLoginDisconnect = disconnect;

            // request user's account
            provider.request({ method: 'eth_accounts' }).then(([account]) => {
                setAccount(account);
                setIsLoggedIn(true);
            });
        }).catch((error) => {
            disconnect();
        });

    const disconnect = async () => {
        await disconnect;
        setProvider(null);
        setAccount(null);
        setAccountData({
            Wallet: '',
            Owner: '',
            Balance: 0,
            GasPrice: 0,
            truncatedAddress: ''
        });
        setUserBalanceData(null);
        setIsLoggedIn(false);
        if (window?.rLoginDisconnect){
            await window?.rLoginDisconnect();
        }
        connect();
        disableLogin();
    };

    const buildInterfaceContext = () => {
        return {
            web3,
            contractStatusData,
            userBalanceData,
            account
        };
    };

    const interfaceAllowanceAmount = async (
        currencyYouExchange,
        currencyYouReceive,
        amountAllowance,
        onTransaction,
        onReceipt
    ) => {
        if (!window.dContracts) return;

        const approveInfo = ApproveTokenContract(
            window.dContracts,
            currencyYouExchange,
            currencyYouReceive
        );
        if (approveInfo.token) {
            const interfaceContext = buildInterfaceContext();
            await AllowanceAmount(
                interfaceContext,
                approveInfo.token,
                approveInfo.contractAllow,
                amountAllowance,
                approveInfo.decimals,
                onTransaction,
                onReceipt
            );
        }
    };

    const interfaceTransferToken = async (
        currencyYouExchange,
        amount,
        destinationAddress,
        onTransaction,
        onReceipt
    ) => {
        if (!window.dContracts) return;

        const tContract = TokenContract(window.dContracts, currencyYouExchange);
        if (tContract.token) {
            const interfaceContext = buildInterfaceContext();
            await transferTokenTo(
                interfaceContext,
                tContract.token,
                tContract.decimals,
                destinationAddress,
                amount,
                onTransaction,
                onReceipt
            );
        }
    };

    const interfaceExchangeMethod = async (
        currencyYouExchange,
        currencyYouReceive,
        tokenAmount,
        limitAmount,
        onTransaction,
        onReceipt
    ) => {
        const interfaceContext = buildInterfaceContext();
        return exchangeMethod(
            interfaceContext,
            currencyYouExchange,
            currencyYouReceive,
            tokenAmount,
            limitAmount,
            onTransaction,
            onReceipt
        );
    };

    const interfaceAllowUseTokenMigrator = async (amount, onTransaction, onReceipt, onError) => {
        const interfaceContext = buildInterfaceContext();
        return AllowUseTokenMigrator(interfaceContext, amount, onTransaction, onReceipt, onError);
    };

    const interfaceMigrateToken = async (onTransaction, onReceipt, onError) => {
        const interfaceContext = buildInterfaceContext();
        return MigrateToken(interfaceContext, onTransaction, onReceipt, onError);
    };

    const initContractsConnection = async () => {
        window.dContracts = await readContracts(web3);
        await loadContractsStatusAndUserBalance();
    };

    const loadContractsStatusAndUserBalance = async () => {
        if (!window.dContracts) return;

        // Read info from different contract
        // in one call through Multicall
        const dataContractStatus = await contractStatus(
            web3,
            window.dContracts
        );

        const accountBalance = await userBalance(
            web3,
            window.dContracts,
            account
        );

        setContractStatusData(dataContractStatus);
        setUserBalanceData(accountBalance);
    };

    const loadAccountData = async () => {
        const owner = await getAccount();
        const truncateAddress =
            owner.substring(0, 6) +
            '...' +
            owner.substring(owner.length - 4, owner.length);
        const accountData = {
            Wallet: account,
            Owner: owner,
            Balance: await getBalance(account),
            GasPrice: await interfaceGasPrice(),
            truncatedAddress: truncateAddress
        };

        window.address = owner;
        setAccountData(accountData);
    };

    const getAccount = async () => {
        const [owner] = await web3.eth.getAccounts();
        return owner;
    };
    const getBalance = async (address) => {
        try {
            let balance = await web3.eth.getBalance(address);
            balance = web3.utils.fromWei(balance, "ether");
            return balance;
        } catch (e) {
            console.log(e);
        }
    };

    const getSpendableBalance = async (address) => {
        const from = address || account;
        return await web3.eth.getBalance(from);
    };

    const getReserveAllowance = async (address) => {
        const from = address || account;
        return await web3.eth.getBalance(from);
    };

    const getTransactionReceipt = async (hash, callback) => {
        //const web3 = new Web3(provider);
        let transactionReceipt = false;
        let transaction = await web3.eth.getTransactionReceipt(hash);
        if (transaction) {
            transactionReceipt = true;
        }
        return transactionReceipt;
    };

    const toCheckSumAddress = (address) => helper.toCheckSumAddress(address);

    const isCheckSumAddress = (address) => {
        if (address === undefined) return false;
        return helper.isValidAddressChecksum(address);
    };

    const interfaceGasPrice = async () => {
        return getGasPrice(web3);
    };

    const interfaceDecodeEvents = async (receipt) => {
        const txRcp = await web3.eth.getTransactionReceipt(
            receipt.transactionHash
        );
        const filteredEvents = decodeEvents(txRcp);
        return filteredEvents;
    };

    return (
        <AuthenticateContext.Provider
            value={{
                account,
                accountData,
                userBalanceData,
                contractStatusData,
                isLoggedIn,
                web3,
                connect,
                disconnect,
                interfaceAllowanceAmount,
                interfaceTransferToken,
                interfaceExchangeMethod,
                getTransactionReceipt,
                getSpendableBalance,
                getReserveAllowance,
                interfaceDecodeEvents,
                loadContractsStatusAndUserBalance,
                interfaceAllowUseTokenMigrator,
                interfaceMigrateToken
            }}
        >
            {children}
        </AuthenticateContext.Provider>
    );
};

export { AuthenticateContext, AuthenticateProvider };
