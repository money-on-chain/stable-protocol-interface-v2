import Multicall2 from '../../contracts/Multicall2.json';
import CollateralAsset from '../../contracts/CollateralAsset.json';
import TokenPegged from '../../contracts/TokenPegged.json';
import CollateralToken from '../../contracts/CollateralToken.json';
import IPriceProvider from '../../contracts/IPriceProvider.json';
import Moc from '../../contracts/Moc.json';
import MoC from '../../contracts/MoCOld.json';
import MoCState from '../../contracts/MoCState.json';
import TG from '../../contracts/MoCToken.json';
import MoCConnector from '../../contracts/MoCConnector.json';
import MocWrapper from '../../contracts/MocWrapper.json';
import MocVendors from '../../contracts/MocVendors.json';
import FeeToken from '../../contracts/FeeToken.json';
import MocQueue from '../../contracts/MocQueue.json';
import TokenMigrator from '../../contracts/TokenMigrator.json';
//OMOC contracts abis
import IRegistry from '../../contracts/omoc/IRegistry.json';
import IStakingMachine from '../../contracts/omoc/IStakingMachine.json';
import IDelayMachine from '../../contracts/omoc/IDelayMachine.json';
import ISupporters from '../../contracts/omoc/ISupporters.json';
import IVestingMachine from '../../contracts/omoc/IVestingMachine.json';
import IVotingMachine from '../../contracts/omoc/IVotingMachine.json';
import IVestingFactory from '../../contracts/omoc/IVestingFactory.json';
//----------------

import { addABI } from './transaction';
import settings from '../../settings/settings.json';
import {registryAddresses, connectorAddresses } from './multicall';

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
    abiContracts.MoCState = MoCState;
    abiContracts.MocWrapper = MocWrapper;
    abiContracts.MocVendors = MocVendors
    abiContracts.FeeToken = FeeToken
    abiContracts.MocQueue = MocQueue
    abiContracts.TokenMigrator = TokenMigrator;
    abiContracts.IRegistry = IRegistry;
    abiContracts.IStakingMachine = IStakingMachine;
    abiContracts.IDelayMachine = IDelayMachine;
    abiContracts.ISupporters = ISupporters;
    abiContracts.IVestingMachine = IVestingMachine;
    abiContracts.IVotingMachine = IVotingMachine;
    abiContracts.IVestingFactory = IVestingFactory;

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

    // OMOC contracts
    

    const iregistry = new web3.eth.Contract(
        IRegistry.abi,
        process.env.REACT_APP_ENVIRONMENT_IREGISTRY
    );
    dContracts.contracts.iregistry = iregistry;
    // Read contracts addresses from registry
    const [
        mocStakingMachineAddress,
        supportersAddress,
        delayMachineAddress,
        vestingMachineAddress,
        votingMachineAddress,
        // priceProviderRegistryAddress,
        // oracleManagerAddress
    ] = await registryAddresses(web3, dContracts);

     
    console.log(
        'Reading OMOC: IStakingMachine Contract... address: ',
        mocStakingMachineAddress
    );
    const istakingmachine = new web3.eth.Contract(
        IStakingMachine.abi,
        mocStakingMachineAddress
    );
    dContracts.contracts.istakingmachine = istakingmachine;

    console.log(
        'Reading OMOC: ISupporters Contract... address: ',
        supportersAddress
    );
    const isupporters = new web3.eth.Contract(
        ISupporters.abi,
        supportersAddress
    );
    dContracts.contracts.isupporters = isupporters;

    console.log(
        'Reading OMOC: IDelayMachine Contract... address: ',
        delayMachineAddress
    );
    const idelaymachine = new web3.eth.Contract(
        IDelayMachine.abi,
        delayMachineAddress
    );
    dContracts.contracts.idelaymachine = idelaymachine;

    console.log(
        'Reading OMOC: IVestingFactory Contract... address: ',
        vestingMachineAddress
    );
    const ivestingfactory = new web3.eth.Contract(
        IVestingFactory.abi,
        vestingMachineAddress
    );
    dContracts.contracts.ivestingfactory = ivestingfactory;

    console.log(
        'Reading OMOC: IVotingMachine Contract... address: ',
        votingMachineAddress
    );
    const ivotingmachine = new web3.eth.Contract(
        IVotingMachine.abi,
        votingMachineAddress
    );
    dContracts.contracts.ivotingmachine = ivotingmachine;




    // console.log('Reading MoC Contract... address: ', process.env.REACT_APP_ENVIRONMENT_MOC);
    // const moc = new web3.eth.Contract(MoC.abi, process.env.REACT_APP_ENVIRONMENT_MOC);
    // console.log('moc is ', moc);
    // dContracts.contracts.moc = moc;

    // const connectorAddress = await moc.methods.connector().call().catch((err) => {
    //     console.error('Error reading connector address: ', err);
    // });
    // console.log('Reading MoCConnector... address: ', connectorAddress);
    
    // const mocconnector = new web3.eth.Contract(
    //     MoCConnector.abi,
    //     connectorAddress
    // );
    // dContracts.contracts.mocconnector = mocconnector;
    // console.log('mocconector is ', mocconnector);
    // //TODO read/define appMode for flipago and roc
    // const appMode = ''; //Need to be dynamic
    // //Read contracts addresses from connector
    // const [
    //     mocStateAddress,
    //     // mocInrateAddress,
    //     // mocExchangeAddress,
    //     // mocSettlementAddress,
    //     // tpTokenAddress,
    //     // tcTokenAddress,
    //     // reserveTokenAddress
    // ] = await connectorAddresses(web3, dContracts, appMode);

    // console.log('Reading MoC State Contract... address: ', mocStateAddress);
    // const mocstate = new web3.eth.Contract(MoCState.abi, mocStateAddress);
    // dContracts.contracts.mocstate = mocstate;
    
    // const tgTokenAddress = await mocstate.methods.getMoCToken().call();
    // console.log('Reading TG Token Contract... address: ', tgTokenAddress);
    // const tg = new web3.eth.Contract(TG.abi, tgTokenAddress);
    // dContracts.contracts.tg = tg;
    // //----------------

    
    
    

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
