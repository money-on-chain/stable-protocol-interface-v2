
import Multicall2 from '../../contracts/Multicall2.json';
import WrappedCollateralAsset from '../../contracts/WrappedCollateralAsset.json';
import TokenPegged from '../../contracts/TokenPegged.json';
import CollateralTokenCABag from '../../contracts/CollateralTokenCABag.json';
import IPriceProvider from '../../contracts/IPriceProvider.json';
import MocCABag from '../../contracts/MocCABag.json';
import MocCAWrapper from '../../contracts/MocCAWrapper.json';



import { addABI } from './transaction';
import { connectorAddresses, registryAddresses } from './multicall';

import settings from '../../settings/settings.json'


const readContracts = async (web3) => {

  // Store contracts to later use
  const dContracts = {}
  dContracts.json = {}
  dContracts.contracts = {}
  dContracts.contractsAddresses = {}

  // Add to abi decoder
  const abiContracts = {}
  abiContracts.Multicall2 = Multicall2
  abiContracts.WrappedCollateralAsset = WrappedCollateralAsset
  abiContracts.TokenPegged = TokenPegged
  abiContracts.CollateralTokenCABag = CollateralTokenCABag
  abiContracts.IPriceProvider = IPriceProvider
  abiContracts.MocCABag = MocCABag
  abiContracts.MocCAWrapper = MocCAWrapper
  addABI(abiContracts)

  console.log('Reading Multicall2 Contract... address: ', process.env.REACT_APP_ENVIRONMENT_MULTICALL2)
  dContracts.contracts.multicall = new web3.eth.Contract(Multicall2.abi, process.env.REACT_APP_ENVIRONMENT_MULTICALL2)

  console.log(`Reading ${settings.tokens.TP[0].name} Token Contract... address: `, process.env.REACT_APP_CONTRACT_TP_0)
  const TP_0 = new web3.eth.Contract(TokenPegged.abi, process.env.REACT_APP_CONTRACT_TP_0)

  console.log(`Reading ${settings.tokens.TP[1].name} Token Contract... address: `, process.env.REACT_APP_CONTRACT_TP_1)
  const TP_1 = new web3.eth.Contract(TokenPegged.abi, process.env.REACT_APP_CONTRACT_TP_1)

  dContracts.contracts.TP = [TP_0, TP_1]

  console.log(`Reading ${settings.tokens.CA[0].name} Token Contract... address: `, process.env.REACT_APP_CONTRACT_CA_0)
  const CA_0 = new web3.eth.Contract(WrappedCollateralAsset.abi, process.env.REACT_APP_CONTRACT_CA_0)

  console.log(`Reading ${settings.tokens.CA[1].name} Token Contract... address: `, process.env.REACT_APP_CONTRACT_CA_1)
  const CA_1 = new web3.eth.Contract(WrappedCollateralAsset.abi, process.env.REACT_APP_CONTRACT_CA_1)

  dContracts.contracts.CA = [CA_0, CA_1]

  console.log(`Reading Price Provider ${settings.tokens.TP[0].name} Contract... address: `, process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_TP_0)
  const PP_TP_0 = new web3.eth.Contract(IPriceProvider.abi, process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_TP_0)

  console.log(`Reading Price Provider ${settings.tokens.TP[1].name} Contract... address: `, process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_TP_1)
  const PP_TP_1 = new web3.eth.Contract(IPriceProvider.abi, process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_TP_1)

  dContracts.contracts.PP_TP = [PP_TP_0, PP_TP_1]

  console.log(`Reading Price Provider ${settings.tokens.CA[0].name} Tokens Contract... address: `, process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_CA_0)
  const PP_CA_0 = new web3.eth.Contract(IPriceProvider.abi, process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_CA_0)

  console.log(`Reading Price Provider ${settings.tokens.CA[1].name} Tokens Contract... address: `, process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_CA_1)
  const PP_CA_1 = new web3.eth.Contract(IPriceProvider.abi, process.env.REACT_APP_CONTRACT_PRICE_PROVIDER_CA_1)

  dContracts.contracts.PP_CA = [PP_CA_0, PP_CA_1]

  console.log('Reading MocCABag Contract... address: ', process.env.REACT_APP_CONTRACT_MOC_CA)
  dContracts.contracts.MocCABag = new web3.eth.Contract(MocCABag.abi, process.env.REACT_APP_CONTRACT_MOC_CA)

  console.log('Reading MocCAWrapper Contract... address: ', process.env.REACT_APP_CONTRACT_MOC_CA_WRAPPER)
  dContracts.contracts.MocCAWrapper = new web3.eth.Contract(MocCAWrapper.abi, process.env.REACT_APP_CONTRACT_MOC_CA_WRAPPER)

  console.log('Reading CollateralTokenCABag Contract... address: ', process.env.REACT_APP_CONTRACT_TC)
  dContracts.contracts.CollateralTokenCABag = new web3.eth.Contract(CollateralTokenCABag.abi, process.env.REACT_APP_CONTRACT_TC)


  return dContracts
}


export { readContracts };