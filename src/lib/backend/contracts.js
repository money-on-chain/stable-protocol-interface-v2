import Multicall2 from '../../contracts/Multicall2.json';
import CollateralAsset from '../../contracts/CollateralAsset.json';
import TokenPegged from '../../contracts/TokenPegged.json';
import CollateralToken from '../../contracts/CollateralToken.json';
import IPriceProvider from '../../contracts/IPriceProvider.json';
import Moc from '../../contracts/Moc.json';
import MocWrapper from '../../contracts/MocWrapper.json';
import MocVendors from '../../contracts/MocVendors.json';
import FeeToken from '../../contracts/FeeToken.json';
import MocQueue from '../../contracts/MocQueue.json';
import TokenMigrator from '../../contracts/TokenMigrator.json';

import { addABI } from './transaction';
import settings from '../../settings/settings.json';

const readContracts = async (web3) => {
    // Store contracts to later use
    const dContracts = {};
    dContracts.json = {};
    dContracts.contracts = {};
    dContracts.contractsAddresses = {};

    // Add to abi decoder
    const abiContracts = {};
    abiContracts.Multicall2 = Multicall2;
    abiContracts.CollateralAsset = CollateralAsset;
    abiContracts.TokenPegged = TokenPegged;
    abiContracts.CollateralToken = CollateralToken;
    abiContracts.IPriceProvider = IPriceProvider;
    abiContracts.Moc = Moc;
    abiContracts.MocWrapper = MocWrapper;
    abiContracts.MocVendors = MocVendors
    abiContracts.FeeToken = FeeToken
    abiContracts.MocQueue = MocQueue
    abiContracts.TokenMigrator = TokenMigrator;

    addABI(abiContracts);

    console.log(
        'Reading Multicall2 Contract... address: ',
        process.env.REACT_APP_CONTRACT_MULTICALL2
    );
    dContracts.contracts.multicall = new web3.eth.Contract(
        Multicall2.abi,
        process.env.REACT_APP_CONTRACT_MULTICALL2
    );

    dContracts.contracts.TP = []
    const contractTP = process.env.REACT_APP_CONTRACT_TP.split(",")
    for (let i = 0; i < settings.tokens.TP.length; i++) {
        console.log(`Reading ${settings.tokens.TP[i].name} Token Contract... address: `, contractTP[i])
        dContracts.contracts.TP.push(new web3.eth.Contract(TokenPegged.abi, contractTP[i]))
    }

    dContracts.contracts.CA = []
    const contractCA = process.env.REACT_APP_CONTRACT_CA.split(",")
    for (let i = 0; i < settings.tokens.CA.length; i++) {
        console.log(`Reading ${settings.tokens.CA[i].name} Token Contract... address: `, contractCA[i])
        dContracts.contracts.CA.push(new web3.eth.Contract(CollateralAsset.abi, contractCA[i]))
    }

    dContracts.contracts.PP_TP = []
    const contractPPTP = process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_TP.split(",")
    for (let i = 0; i < settings.tokens.TP.length; i++) {
        console.log(`Reading Price Provider ${settings.tokens.TP[i].name} Contract... address: `, contractPPTP[i])
        dContracts.contracts.PP_TP.push(new web3.eth.Contract(IPriceProvider.abi, contractPPTP[i]))
    }

    dContracts.contracts.PP_CA = []
    const contractPPCA = process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_CA.split(",")
    for (let i = 0; i < settings.tokens.CA.length; i++) {
        console.log(`Reading Price Provider ${settings.tokens.CA[i].name} Tokens Contract... address: `, contractPPCA[i])
        dContracts.contracts.PP_CA.push(new web3.eth.Contract(IPriceProvider.abi, contractPPCA[i]))
    }

    console.log(
        `Reading Price Provider ${settings.tokens.COINBASE.name} Contract... address: `,
        process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_COINBASE
    );
    dContracts.contracts.PP_COINBASE = new web3.eth.Contract(
        IPriceProvider.abi,
        process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_COINBASE
    );

    console.log(
        'Reading Moc Contract... address: ',
        process.env.REACT_APP_CONTRACT_MOC
    );
    dContracts.contracts.Moc = new web3.eth.Contract(
        Moc.abi,
        process.env.REACT_APP_CONTRACT_MOC
    );

    console.log(
        'Reading Collateral Token Contract... address: ',
        process.env.REACT_APP_CONTRACT_TC
    );
    dContracts.contracts.CollateralToken = new web3.eth.Contract(
        CollateralToken.abi,
        process.env.REACT_APP_CONTRACT_TC
    );

    console.log(
        'Reading Moc Vendors Contract... address: ',
        process.env.REACT_APP_CONTRACT_MOC_VENDORS
    );
    dContracts.contracts.MocVendors = new web3.eth.Contract(
        MocVendors.abi,
        process.env.REACT_APP_CONTRACT_MOC_VENDORS
    );

    console.log(
        'Reading MocQueue Contract... address: ',
        process.env.REACT_APP_CONTRACT_MOC_QUEUE
    );
    dContracts.contracts.MocQueue = new web3.eth.Contract(
        MocQueue.abi,
        process.env.REACT_APP_CONTRACT_MOC_QUEUE
    );

    console.log(
        'Reading FeeToken Contract... address: ',
        process.env.REACT_APP_CONTRACT_FEE_TOKEN
    );
    dContracts.contracts.FeeToken = new web3.eth.Contract(
        FeeToken.abi,
        process.env.REACT_APP_CONTRACT_FEE_TOKEN
    );

    console.log(
        'Reading Fee Token PP Contract... address: ',
        process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_FEE_TOKEN
    );
    dContracts.contracts.PP_FeeToken = new web3.eth.Contract(
        IPriceProvider.abi,
        process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_FEE_TOKEN
    );

    console.log(
        'Reading FC_MAX_ABSOLUTE_OP_PROVIDER Contract... address: ',
        process.env.REACT_APP_CONTRACT_FC_MAX_ABSOLUTE_OP_PROVIDER
    );
    dContracts.contracts.FC_MAX_ABSOLUTE_OP_PROVIDER = new web3.eth.Contract(
        IPriceProvider.abi,
        process.env.REACT_APP_CONTRACT_FC_MAX_ABSOLUTE_OP_PROVIDER
    );

    console.log(
        'Reading FC_MAX_OP_DIFFERENCE_PROVIDER Contract... address: ',
        process.env.REACT_APP_CONTRACT_FC_MAX_OP_DIFFERENCE_PROVIDER
    );
    dContracts.contracts.FC_MAX_OP_DIFFERENCE_PROVIDER = new web3.eth.Contract(
        IPriceProvider.abi,
        process.env.REACT_APP_CONTRACT_FC_MAX_OP_DIFFERENCE_PROVIDER
    );

    // Note: Collateral Bag Not Supported!
    /*
    if (settings.collateral === 'bag') {
        console.log(
            'Reading MocWrapper Contract... address: ',
            process.env.REACT_APP_CONTRACT_MOC_WRAPPER
        );
        dContracts.contracts.MocWrapper = new web3.eth.Contract(
            MocWrapper.abi,
            process.env.REACT_APP_CONTRACT_MOC_WRAPPER
        );
    }*/

    // Token migrator & Legacy token
    if (process.env.REACT_APP_CONTRACT_LEGACY_TP) {

        const tpLegacy = new web3.eth.Contract(TokenPegged.abi, process.env.REACT_APP_CONTRACT_LEGACY_TP)
        dContracts.contracts.tp_legacy = tpLegacy

        if (!process.env.REACT_APP_CONTRACT_TOKEN_MIGRATOR) console.log("Error: Please set token migrator address!")

        const tokenMigrator = new web3.eth.Contract(TokenMigrator.abi, process.env.REACT_APP_CONTRACT_TOKEN_MIGRATOR)
        dContracts.contracts.token_migrator = tokenMigrator
    }


    return dContracts;
};

export { readContracts };
