import {
    mintTC as mintTC_, redeemTC as redeemTC_, mintTP as mintTP_, redeemTP as redeemTP_
} from './moc-core.jsx'

const mintTC = async (
    interfaceContext,
    qTC,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Mint Collateral token with CA support vendors
    return mintTC_(
        interfaceContext,
        0,
        qTC,
        limitAmount,
        onTransaction,
        onReceipt
    )
}

const redeemTC = async (
    interfaceContext,
    qTC,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Redeem Collateral token receiving CA support vendors
    return redeemTC_(
        interfaceContext,
        0,
        qTC,
        limitAmount,
        onTransaction,
        onReceipt
    )
}

const mintTP = async (
    interfaceContext,
    tpIndex,
    qTP,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Mint pegged token with collateral CA BAG support vendor
    return mintTP_(
        interfaceContext,
        0,
        tpIndex,
        qTP,
        limitAmount,
        onTransaction,
        onReceipt
    )
}

const redeemTP = async (
    interfaceContext,
    tpIndex,
    qTP,
    limitAmount,
    onTransaction,
    onReceipt
) => {
    // Redeem pegged token receiving CA support vendor
    return redeemTP_(
        interfaceContext,
        0,
        tpIndex,
        qTP,
        limitAmount,
        onTransaction,
        onReceipt
    )
}

export {
    mintTC,
    redeemTC,
    mintTP,
    redeemTP
}
