import abiDecoder from 'abi-decoder';
import Web3 from 'web3';

const addABI = (abiContracts) => {

  // Abi decoder
  abiDecoder.addABI(abiContracts.WrappedCollateralAsset.abi)
  abiDecoder.addABI(abiContracts.TokenPegged.abi)
  abiDecoder.addABI(abiContracts.CollateralTokenCABag.abi)
  abiDecoder.addABI(abiContracts.MocCABag.abi)
  abiDecoder.addABI(abiContracts.MocCAWrapper.abi)

}

const renderEventField = (eveName, eveValue) => {
  const formatItemsWei = new Set([
    'amount',
    'interests',
    'leverage',
    'value',
    'qTC_',
    'qAsset_',
    'qACfee_',
    'qAC_',
    'oldTPema_',
    'newTPema_',
    'qTP_'])

  if (formatItemsWei.has(eveName)) { eveValue = Web3.utils.fromWei(eveValue) }

  console.log('\x1b[32m%s\x1b[0m', `${eveName}: ${eveValue}`)
}

const renderEvent = (evente) => {
  console.log('')
  console.log('\x1b[35m%s\x1b[0m', `Event: ${evente.name}`)
  console.log('')
  evente.events.forEach(eve => renderEventField(eve.name, eve.value))
}

const decodeEvents = (receipt) => {

  if (!receipt.logs) return;

  const decodedLogs = abiDecoder.decodeLogs(receipt.logs)

  const filterIncludes = [
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
    'TCMintedWithWrapper',
    'TCRedeemedWithWrapper',
    'TPMintedWithWrapper',
    'TPRedeemedWithWrapper',
    'TCandTPMintedWithWrapper',
    'TCandTPRedeemedWithWrapper',
    'TPSwappedForTPWithWrapper',
    'TPSwappedForTCWithWrapper',
    'TCSwappedForTPWithWrapper'
  ]

  const filteredEvents = decodedLogs.filter(event =>
    filterIncludes.includes(event.name)
  )

  filteredEvents.forEach(evente => renderEvent(evente))

  return filteredEvents
}


export { addABI, decodeEvents };