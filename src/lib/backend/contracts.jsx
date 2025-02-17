import Multicall2 from "../../contracts/Multicall2.json";
import CollateralAsset from "../../contracts/CollateralAsset.json";
import TokenPegged from "../../contracts/TokenPegged.json";
import CollateralToken from "../../contracts/CollateralToken.json";
import IPriceProvider from "../../contracts/IPriceProvider.json";
import Moc from "../../contracts/Moc.json";
import MocVendors from "../../contracts/MocVendors.json";
import FeeToken from "../../contracts/FeeToken.json";
import MocQueue from "../../contracts/MocQueue.json";
import TokenMigrator from "../../contracts/TokenMigrator.json";

// OMOC
import IRegistry from "../../contracts/omoc/IRegistry.json";
import StakingMachine from "../../contracts/omoc/StakingMachine.json";
import DelayMachine from "../../contracts/omoc/DelayMachine.json";
import Supporters from "../../contracts/omoc/Supporters.json";
//import VestingMachine from "../../contracts/omoc/VestingMachine.json";
import VotingMachine from "../../contracts/omoc/VotingMachine.json";
import VestingFactory from "../../contracts/omoc/VestingFactory.json";
import IERC20 from "../../contracts/omoc/IERC20.json";
import IncentiveV2 from "../../contracts/omoc/IncentiveV2.json";

import { registryAddresses, mocAddresses } from "./multicall";
import settings from "../../settings/settings.json";

const readContracts = async (web3) => {
    // Store contracts to later use
    const dContracts = {};
    dContracts.json = {};
    dContracts.contracts = {};
    dContracts.contractsAddresses = {};

    console.log(
        "Reading Multicall2 Contract... address: ",
        import.meta.env.REACT_APP_CONTRACT_MULTICALL2
    );
    dContracts.contracts.multicall = new web3.eth.Contract(
        Multicall2.abi,
        import.meta.env.REACT_APP_CONTRACT_MULTICALL2
    );

    dContracts.contracts.PP_CA = [];
    const contractPPCA =
        import.meta.env.REACT_APP_CONTRACT_PRICE_PROVIDER_CA.split(",");
    for (let i = 0; i < settings.tokens.CA.length; i++) {
        console.log(
            `Reading Price Provider ${settings.tokens.CA[i].name} Tokens Contract... address: `,
            contractPPCA[i]
        );
        dContracts.contracts.PP_CA.push(
            new web3.eth.Contract(IPriceProvider.abi, contractPPCA[i])
        );
    }

    console.log(
        `Reading Price Provider ${settings.tokens.COINBASE.name} Contract... address: `,
        import.meta.env.REACT_APP_CONTRACT_PRICE_PROVIDER_COINBASE
    );
    dContracts.contracts.PP_COINBASE = new web3.eth.Contract(
        IPriceProvider.abi,
        import.meta.env.REACT_APP_CONTRACT_PRICE_PROVIDER_COINBASE
    );

    console.log(
        "Reading Moc Contract... address: ",
        import.meta.env.REACT_APP_CONTRACT_MOC
    );
    dContracts.contracts.Moc = new web3.eth.Contract(
        Moc.abi,
        import.meta.env.REACT_APP_CONTRACT_MOC
    );

    // Read contracts addresses from MoC
    const mocAddr = await mocAddresses(web3, dContracts);
    dContracts.contracts.CA = [];

    if (settings.collateral !== "coinbase") {
        const contractCA = [mocAddr["acToken"]];
        for (let i = 0; i < settings.tokens.CA.length; i++) {
            console.log(
                `Reading ${settings.tokens.CA[i].name} Token Contract... address: `,
                contractCA[i]
            );
            dContracts.contracts.CA.push(
                new web3.eth.Contract(CollateralAsset.abi, contractCA[i])
            );
        }
    }

    const MAX_LEN_ARRAY_TP = 4;
    const tpAddresses = [];
    let tpAddressesProviders = [];
    let tpAddress;
    let tpIndex;
    let tpItem;
    for (let i = 0; i < MAX_LEN_ARRAY_TP; i++) {
        try {
            tpAddress = mocAddr["tpTokens"][i];
            if (!tpAddress || tpAddress === '0x') continue;
            tpIndex = await dContracts.contracts.Moc.methods
                .peggedTokenIndex(tpAddress)
                .call();
            if (!tpIndex.exists) continue;
            tpItem = await dContracts.contracts.Moc.methods
                .pegContainer(tpIndex.index)
                .call();
            tpAddresses.push(tpAddress);
            tpAddressesProviders.push(tpItem.priceProvider);
        } catch (e) {
            console.error(e);
            break;
        }
    }

    dContracts.contracts.TP = [];
    for (let i = 0; i < settings.tokens.TP.length; i++) {
        console.log(
            `Reading ${settings.tokens.TP[i].name} Token Contract... address: `,
            tpAddresses[i]
        );
        dContracts.contracts.TP.push(
            new web3.eth.Contract(TokenPegged.abi, tpAddresses[i])
        );
    }

    dContracts.contracts.PP_TP = [];
    for (let i = 0; i < settings.tokens.TP.length; i++) {
        console.log(
            `Reading Price Provider ${settings.tokens.TP[i].name} Contract... address: `,
            tpAddressesProviders[i]
        );
        dContracts.contracts.PP_TP.push(
            new web3.eth.Contract(IPriceProvider.abi, tpAddressesProviders[i])
        );
    }

    console.log(
        "Reading Collateral Token Contract... address: ",
        mocAddr["tcToken"]
    );
    dContracts.contracts.CollateralToken = new web3.eth.Contract(
        CollateralToken.abi,
        mocAddr["tcToken"]
    );

    console.log(
        "Reading Moc Vendors Contract... address: ",
        mocAddr["mocVendors"]
    );
    dContracts.contracts.MocVendors = new web3.eth.Contract(
        MocVendors.abi,
        mocAddr["mocVendors"]
    );

    console.log("Reading MocQueue Contract... address: ", mocAddr["mocQueue"]);
    dContracts.contracts.MocQueue = new web3.eth.Contract(
        MocQueue.abi,
        mocAddr["mocQueue"]
    );

    console.log("Reading FeeToken Contract... address: ", mocAddr["feeToken"]);
    dContracts.contracts.FeeToken = new web3.eth.Contract(
        FeeToken.abi,
        mocAddr["feeToken"]
    );

    console.log(
        "Reading Fee Token PP Contract... address: ",
        mocAddr["feeTokenPriceProvider"]
    );
    dContracts.contracts.PP_FeeToken = new web3.eth.Contract(
        IPriceProvider.abi,
        mocAddr["feeTokenPriceProvider"]
    );

    console.log(
        "Reading FC_MAX_ABSOLUTE_OP_PROVIDER Contract... address: ",
        mocAddr["maxAbsoluteOpProvider"]
    );
    dContracts.contracts.FC_MAX_ABSOLUTE_OP_PROVIDER = new web3.eth.Contract(
        IPriceProvider.abi,
        mocAddr["maxAbsoluteOpProvider"]
    );

    console.log(
        "Reading FC_MAX_OP_DIFFERENCE_PROVIDER Contract... address: ",
        mocAddr["maxOpDiffProvider"]
    );
    dContracts.contracts.FC_MAX_OP_DIFFERENCE_PROVIDER = new web3.eth.Contract(
        IPriceProvider.abi,
        mocAddr["maxOpDiffProvider"]
    );

    if (typeof import.meta.env.REACT_APP_CONTRACT_IREGISTRY !== "undefined") {
        console.log(
            "Reading IRegistry Contract... address: ",
            import.meta.env.REACT_APP_CONTRACT_IREGISTRY
        );
        dContracts.contracts.IRegistry = new web3.eth.Contract(
            IRegistry.abi,
            import.meta.env.REACT_APP_CONTRACT_IREGISTRY
        );

        // Read contracts addresses from registry
        const registryAddr = await registryAddresses(web3, dContracts);

        console.log(
            "Reading StakingMachine Contract... address: ",
            registryAddr["MOC_STAKING_MACHINE"]
        );
        dContracts.contracts.StakingMachine = new web3.eth.Contract(
            StakingMachine.abi,
            registryAddr["MOC_STAKING_MACHINE"]
        );

        console.log(
            "Reading Delay Machine Contract... address: ",
            registryAddr["MOC_DELAY_MACHINE"]
        );
        dContracts.contracts.DelayMachine = new web3.eth.Contract(
            DelayMachine.abi,
            registryAddr["MOC_DELAY_MACHINE"]
        );

        console.log(
            "Reading Supporters Contract... address: ",
            registryAddr["SUPPORTERS_ADDR"]
        );
        dContracts.contracts.Supporters = new web3.eth.Contract(
            Supporters.abi,
            registryAddr["SUPPORTERS_ADDR"]
        );

        console.log(
            "Reading Vesting Factory Contract... address: ",
            registryAddr["MOC_VESTING_MACHINE"]
        );
        dContracts.contracts.VestingFactory = new web3.eth.Contract(
            VestingFactory.abi,
            registryAddr["MOC_VESTING_MACHINE"]
        );

        // reading Incentive V2 from environment address
        if (
            typeof import.meta.env.REACT_APP_CONTRACT_INCENTIVE_V2 !==
            "undefined"
        ) {
            console.log(
                "Reading Incentive V2 Contract... address: ",
                import.meta.env.REACT_APP_CONTRACT_INCENTIVE_V2
            );
            dContracts.contracts.IncentiveV2 = new web3.eth.Contract(
                IncentiveV2.abi,
                import.meta.env.REACT_APP_CONTRACT_INCENTIVE_V2
            );
        }

        console.log(
            "Reading Voting Machine Contract... address: ",
            registryAddr["MOC_VOTING_MACHINE"]
        );
        dContracts.contracts.VotingMachine = new web3.eth.Contract(
            VotingMachine.abi,
            registryAddr["MOC_VOTING_MACHINE"]
        );

        console.log(
            "Reading Token Govern Contract... address: ",
            registryAddr["MOC_TOKEN"]
        );
        dContracts.contracts.TG = new web3.eth.Contract(
            IERC20.abi,
            registryAddr["MOC_TOKEN"]
        );
    }

    // Token migrator & Legacy token
    if (import.meta.env.REACT_APP_CONTRACT_LEGACY_TP) {
        const tpLegacy = new web3.eth.Contract(
            TokenPegged.abi,
            import.meta.env.REACT_APP_CONTRACT_LEGACY_TP
        );
        dContracts.contracts.tp_legacy = tpLegacy;

        if (!import.meta.env.REACT_APP_CONTRACT_TOKEN_MIGRATOR)
            console.log("Error: Please set token migrator address!");

        const tokenMigrator = new web3.eth.Contract(
            TokenMigrator.abi,
            import.meta.env.REACT_APP_CONTRACT_TOKEN_MIGRATOR
        );
        dContracts.contracts.token_migrator = tokenMigrator;
    }

    return dContracts;
};

export { readContracts };
