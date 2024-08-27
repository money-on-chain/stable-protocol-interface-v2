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

// OMOC
import IRegistry from '../../contracts/omoc/IRegistry.json';
import StakingMachine from '../../contracts/omoc/StakingMachine.json';
import DelayMachine from '../../contracts/omoc/DelayMachine.json';
import Supporters from '../../contracts/omoc/Supporters.json';
import VestingMachine from '../../contracts/omoc/VestingMachine.json';
import VotingMachine from '../../contracts/omoc/VotingMachine.json';
import VestingFactory from '../../contracts/omoc/VestingFactory.json';
import IERC20 from '../../contracts/omoc/IERC20.json';

import { registryAddresses } from './multicall';
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

    // Abi OMOC
    abiContracts.IRegistry = IRegistry;
    abiContracts.StakingMachine = StakingMachine;
    abiContracts.DelayMachine = DelayMachine;
    abiContracts.Supporters = Supporters;
    abiContracts.VestingMachine = VestingMachine;
    abiContracts.VotingMachine = VotingMachine;

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

    console.log(
        'Reading IRegistry Contract... address: ',
        process.env.REACT_APP_CONTRACT_IREGISTRY
    );
    dContracts.contracts.IRegistry = new web3.eth.Contract(
        IRegistry.abi,
        process.env.REACT_APP_CONTRACT_IREGISTRY
    );

    // Read contracts addresses from registry
    const registryAddr = await registryAddresses(web3, dContracts)

    console.log(
        'Reading StakingMachine Contract... address: ',
        registryAddr['MOC_STAKING_MACHINE']
    );
    dContracts.contracts.StakingMachine = new web3.eth.Contract(
        StakingMachine.abi,
        registryAddr['MOC_STAKING_MACHINE']
    );

    console.log(
        'Reading Delay Machine Contract... address: ',
        registryAddr['MOC_DELAY_MACHINE']
    );
    dContracts.contracts.DelayMachine = new web3.eth.Contract(
        DelayMachine.abi,
        registryAddr['MOC_DELAY_MACHINE']
    );

    console.log(
        'Reading Supporters Contract... address: ',
        registryAddr['SUPPORTERS_ADDR']
    );
    dContracts.contracts.Supporters = new web3.eth.Contract(
        Supporters.abi,
        registryAddr['SUPPORTERS_ADDR']
    );

    console.log(
        'Reading Vesting Factory Contract... address: ',
        registryAddr['MOC_VESTING_MACHINE']
    );
    dContracts.contracts.VestingFactory = new web3.eth.Contract(
        VestingFactory.abi,
        registryAddr['MOC_VESTING_MACHINE']
    );

    // reading vesting machine from environment address
    if (typeof process.env.REACT_APP_CONTRACT_OMOC_VESTING_ADDRESS !== 'undefined') {

        console.log(
            'Reading Vesting Machine Contract... address: ',
            process.env.REACT_APP_CONTRACT_OMOC_VESTING_ADDRESS
        );
        dContracts.contracts.VestingMachine = new web3.eth.Contract(
            VestingMachine.abi,
            process.env.REACT_APP_CONTRACT_OMOC_VESTING_ADDRESS
        );

    }

    console.log(
        'Reading Voting Machine Contract... address: ',
        registryAddr['MOC_VOTING_MACHINE']
    );
    dContracts.contracts.VotingMachine = new web3.eth.Contract(
        VotingMachine.abi,
        registryAddr['MOC_VOTING_MACHINE']
    );

    console.log(
        'Reading Token Govern Contract... address: ',
        registryAddr['MOC_TOKEN']
    );
    dContracts.contracts.TG = new web3.eth.Contract(
        IERC20.abi,
        registryAddr['MOC_TOKEN']
    );


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
