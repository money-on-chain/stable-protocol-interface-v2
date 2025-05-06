import BigNumber from "bignumber.js";
import Web3 from "web3";

import settings from "../../settings/settings.json";
import {
    toContractPrecisionDecimals,
    getGasPrice,
    fromContractPrecisionDecimals,
} from "./utils";

const mintTC = async (
    interfaceContext,
    caIndex,
    qTC,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Mint Collateral token with CA
    const { web3, contractStatusData, userBalanceData, account } =
        interfaceContext;
    const dContracts = window.dContracts;
    const vendorAddress = import.meta.env.REACT_APP_ENVIRONMENT_VENDOR_ADDRESS;
    const MoCContract = dContracts.contracts.Moc;

    // Verifications

    // User have sufficient reserve to pay?
    console.log(
        `To mint ${qTC} ${
            settings.tokens.TC[0].name
        } you need > ${limitAmount.toString()} ${
            settings.tokens.CA[caIndex].name
        } in your balance`
    );
    const userReserveBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.CA[caIndex].balance,
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (limitAmount.gt(userReserveBalance))
        throw new Error(
            `Insufficient ${settings.tokens.CA[caIndex].name} balance`
        );

    // Allowance    reserveAllowance
    console.log(
        `Allowance: To mint ${qTC} ${
            settings.tokens.TC[0].name
        } you need > ${limitAmount.toString()} ${
            settings.tokens.CA[caIndex].name
        } in your spendable balance`
    );
    /*
    const userSpendableBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.CA[caIndex].allowance,
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (limitAmount.gt(userSpendableBalance))
        throw new Error(
            'Insufficient spendable balance... please make an allowance to the MoC contract'
        );
    */

    const valueToSend = contractStatusData.tcMintExecFee;

    // Calculate estimate gas cost
    const estimateGas = await MoCContract.methods
        .mintTC(
            toContractPrecisionDecimals(
                new BigNumber(qTC),
                settings.tokens.TC[0].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            ),
            account,
            vendorAddress
        )
        .estimateGas({ from: account, value: valueToSend });

    const receipt = MoCContract.methods
        .mintTC(
            toContractPrecisionDecimals(
                new BigNumber(qTC),
                settings.tokens.TC[0].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            ),
            account,
            vendorAddress
        )
        .send({
            from: account,
            value: valueToSend,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas,
            gasLimit: estimateGas,
        })
        .on("transactionHash", onTransaction)
        .on("receipt", onReceipt);

    return receipt;
};

const redeemTC = async (
    interfaceContext,
    caIndex,
    qTC,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Redeem Collateral token receiving CA

    const { web3, contractStatusData, userBalanceData, account } =
        interfaceContext;
    const dContracts = window.dContracts;
    const vendorAddress = import.meta.env.REACT_APP_ENVIRONMENT_VENDOR_ADDRESS;
    const MoCContract = dContracts.contracts.Moc;

    // Verifications

    // User have sufficient TC in balance?
    console.log(
        `Redeeming ${qTC} ${settings.tokens.TC[0].name} ... getting approx limit down to: ${limitAmount} ${settings.tokens.CA[caIndex].name}... `
    );
    const userTCBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData[0].TC.balance,
            settings.tokens.TC[0].decimals
        )
    );
    if (new BigNumber(qTC).gt(userTCBalance))
        throw new Error(
            `Insufficient ${settings.tokens.TC[0].name} user balance`
        );

    // There are sufficient TC in the contracts to redeem?
    const tcAvailableToRedeem = new BigNumber(
        Web3.utils.fromWei(contractStatusData.getTCAvailableToRedeem, "ether")
    );
    if (new BigNumber(qTC).gt(tcAvailableToRedeem))
        throw new Error(
            `Insufficient ${settings.tokens.TC[0].name}available to redeem in contract`
        );

    // There are sufficient CA in the contract
    const caBalance = new BigNumber(
        fromContractPrecisionDecimals(
            contractStatusData.getACBalance[caIndex],
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (new BigNumber(limitAmount).gt(caBalance))
        throw new Error(
            `Insufficient ${settings.tokens.CA[caIndex].name} in the contract. Balance: ${caBalance} ${settings.tokens.CA[caIndex].name}`
        );

    const valueToSend = contractStatusData.tcRedeemExecFee;

    // Calculate estimate gas cost
    const estimateGas = await MoCContract.methods
        .redeemTC(
            toContractPrecisionDecimals(
                new BigNumber(qTC),
                settings.tokens.TC[0].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            ),
            account,
            vendorAddress
        )
        .estimateGas({ from: account, value: valueToSend });

    // Send tx
    const receipt = MoCContract.methods
        .redeemTC(
            toContractPrecisionDecimals(
                new BigNumber(qTC),
                settings.tokens.TC[0].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            ),
            account,
            vendorAddress
        )
        .send({
            from: account,
            value: valueToSend,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas,
            gasLimit: estimateGas,
        })
        .on("transactionHash", onTransaction)
        .on("receipt", onReceipt);

    return receipt;
};

const mintTP = async (
    interfaceContext,
    caIndex,
    tpIndex,
    qTP,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Mint pegged token with collateral CA BAG

    const { web3, contractStatusData, userBalanceData, account } =
        interfaceContext;
    const dContracts = window.dContracts;
    const vendorAddress = import.meta.env.REACT_APP_ENVIRONMENT_VENDOR_ADDRESS;
    const MoCContract = dContracts.contracts.Moc;
    const tpAddress = dContracts.contracts.TP[tpIndex].options.address;

    // Verifications
    // User have sufficient reserve to pay?
    console.log(
        `To mint ${qTP} ${
            settings.tokens.TP[tpIndex].name
        } you need > ${limitAmount.toString()} ${
            settings.tokens.CA[caIndex].name
        } in your balance`
    );
    const userReserveBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.CA[caIndex].balance,
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (limitAmount.gt(userReserveBalance))
        throw new Error(
            `Insufficient ${settings.tokens.CA[caIndex].name} balance`
        );

    // Allowance
    console.log(
        `Allowance: To mint ${qTP} ${
            settings.tokens.TP[tpIndex].name
        } you need > ${limitAmount.toString()} ${
            settings.tokens.CA[caIndex].name
        } in your spendable balance`
    );
    /*
    const userSpendableBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.CA[caIndex].allowance,
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (limitAmount.gt(userSpendableBalance))
        throw new Error(
            'Insufficient spendable balance... please make an allowance to the MoC contract'
        );

     */

    // There are sufficient PEGGED in the contracts to mint?
    const tpAvailableToMint = new BigNumber(
        fromContractPrecisionDecimals(
            contractStatusData.getTPAvailableToMint[tpIndex],
            settings.tokens.TP[tpIndex].decimals
        )
    );

    if (new BigNumber(qTP).gt(tpAvailableToMint))
        throw new Error(
            `Insufficient ${settings.tokens.TP[tpIndex].name} available to mint`
        );

    const valueToSend = contractStatusData.tpMintExecFee;

    // Calculate estimate gas cost
    const estimateGas = await MoCContract.methods
        .mintTP(
            tpAddress,
            toContractPrecisionDecimals(
                new BigNumber(qTP),
                settings.tokens.TP[tpIndex].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            ),
            account,
            vendorAddress
        )
        .estimateGas({ from: account, value: valueToSend });

    // Send tx
    const receipt = MoCContract.methods
        .mintTP(
            tpAddress,
            toContractPrecisionDecimals(
                new BigNumber(qTP),
                settings.tokens.TP[tpIndex].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            ),
            account,
            vendorAddress
        )
        .send({
            from: account,
            value: valueToSend,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas,
            gasLimit: estimateGas,
        })
        .on("transactionHash", onTransaction)
        .on("receipt", onReceipt);

    return receipt;
};

const redeemTP = async (
    interfaceContext,
    caIndex,
    tpIndex,
    qTP,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Redeem pegged token receiving CA

    const { web3, contractStatusData, userBalanceData, account } =
        interfaceContext;
    const dContracts = window.dContracts;
    const vendorAddress = import.meta.env.REACT_APP_ENVIRONMENT_VENDOR_ADDRESS;
    const MoCContract = dContracts.contracts.Moc;
    const tpAddress = dContracts.contracts.TP[tpIndex].options.address;

    // Verifications

    // User have sufficient PEGGED Token in balance?
    console.log(
        `Redeeming ${qTP} ${settings.tokens.TP[tpIndex].name} ... getting approx: ${limitAmount} ${settings.tokens.CA[caIndex].name}... `
    );
    const userTPBalance = new BigNumber(
        fromContractPrecisionDecimals(
            userBalanceData.TP[tpIndex],
            settings.tokens.TP[tpIndex].decimals
        )
    );
    if (new BigNumber(qTP).gt(userTPBalance))
        throw new Error(
            `Insufficient ${settings.tokens.TP[tpIndex].name}  user balance`
        );

    // // There are sufficient Free Pegged Token in the contracts to redeem?
    // const tpAvailableToRedeem = new BigNumber(
    //     Web3.utils.fromWei(contractStatusData.getTPAvailableToMint[tpIndex])
    // );
    // if (new BigNumber(qTP).gt(tpAvailableToRedeem))
    //     throw new Error(
    //         `Insufficient ${settings.tokens.TP[tpIndex].name}  available to redeem in contract`
    //     );

    // There are sufficient CA in the contract
    const caBalance = new BigNumber(
        fromContractPrecisionDecimals(
            contractStatusData.getACBalance[caIndex],
            settings.tokens.CA[caIndex].decimals
        )
    );
    if (new BigNumber(limitAmount).gt(caBalance))
        throw new Error(
            `Insufficient ${settings.tokens.CA[caIndex].name} in the contract. Balance: ${caBalance} ${settings.tokens.CA[caIndex].name}`
        );

    const valueToSend = contractStatusData.tpRedeemExecFee;

    // Calculate estimate gas cost
    const estimateGas = await MoCContract.methods
        .redeemTP(
            tpAddress,
            toContractPrecisionDecimals(
                new BigNumber(qTP),
                settings.tokens.TP[tpIndex].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            ),
            account,
            vendorAddress
        )
        .estimateGas({ from: account, value: valueToSend });

    // Send tx
    const receipt = MoCContract.methods
        .redeemTP(
            tpAddress,
            toContractPrecisionDecimals(
                new BigNumber(qTP),
                settings.tokens.TP[tpIndex].decimals
            ),
            toContractPrecisionDecimals(
                limitAmount,
                settings.tokens.CA[caIndex].decimals
            ),
            account,
            vendorAddress
        )
        .send({
            from: account,
            value: valueToSend,
            gasPrice: await getGasPrice(web3),
            gas: estimateGas,
            gasLimit: estimateGas,
        })
        .on("transactionHash", onTransaction)
        .on("receipt", onReceipt);

    return receipt;
};

export { mintTC, redeemTC, mintTP, redeemTP };
