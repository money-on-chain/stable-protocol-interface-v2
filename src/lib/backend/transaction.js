import abiDecoder from 'abi-decoder';
import Web3 from 'web3';
import settings from '../../settings/settings.json';

const addABI = (abiContracts) => {
    // Abi decoder
    abiDecoder.addABI(abiContracts.TokenPegged.abi);
    abiDecoder.addABI(abiContracts.CollateralToken.abi);
    abiDecoder.addABI(abiContracts.Moc.abi);
    abiDecoder.addABI(abiContracts.MocVendors.abi);
    abiDecoder.addABI(abiContracts.MocQueue.abi);
};

const renderEventField = (eveName, eveValue) => {
    const formatItemsWei = new Set([
        'qTC_',
        'qAsset_',
        'qACfee_',
        'qAC_',
        'oldTPema_',
        'newTPema_',
        'qTP_',
        'TokenMigrated',
        'qFeeToken_',
        'qACVendorMarkup_',
        'qFeeTokenVendorMarkup_',
        'value'
    ]);

    if (formatItemsWei.has(eveName)) {
        eveValue = Web3.utils.fromWei(eveValue, "ether");
    }

    console.log('\x1b[32m%s\x1b[0m', `${eveName}: ${eveValue}`);
};

const renderEvent = (evente) => {
    console.log('');
    console.log('\x1b[35m%s\x1b[0m', `Event: ${evente.name}`);
    console.log('');

    evente.events.forEach(function (eve) {

        if (eve) {
            renderEventField(eve.name, eve.value);
        }
    })


};

const decodeEvents = (receipt) => {
    if (!receipt.logs) return;

    const decodedLogs = abiDecoder.decodeLogs(receipt.logs);

    const filterIncludes = [
        'Transfer',
        'Approval',
        'TCMinted',
        'TCRedeemed',
        'TPMinted',
        'TPRedeemed',
        'TPSwappedForTP',
        'TPSwappedForTC',
        'TCSwappedForTP',
        'TCandTPRedeemed',
        'TCandTPMinted',
        'PeggedTokenChange',
        'SuccessFeeDistributed',
        'TPemaUpdated',
        'BeaconUpgraded',
        'ContractLiquidated',
        'Paused',
        'PeggedTokenChange',
        'SettlementExecuted',
        'SuccessFeeDistributed',
        'TCInterestPayment',
        'AssetModified',
        'VendorMarkupChanged',
        'OperationError',
        'UnhandledError',
        'OperationQueued',
        'OperationExecuted',
        'LiqTPRedeemed',
        'PeggedTokenChange'
    ];

    const filteredEvents = decodedLogs.filter((event) =>
        filterIncludes.includes(event.name)
    );

    filteredEvents.forEach((evente) => renderEvent(evente));

    return filteredEvents;
};

export { addABI, decodeEvents };
