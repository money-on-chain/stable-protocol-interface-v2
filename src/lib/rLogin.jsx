
const getRLogin = (port) => {
    let rpcUrls = {};

    switch (parseInt(port)) {
        case 31:
            rpcUrls = {
                31: 'https://public-node.testnet.rsk.co'
            };
            break;
        case 30:
            rpcUrls = {
                30: 'https://public-node.rsk.co'
            };
            break;
        case 11155111:
            rpcUrls = {
                11155111: 'https://sepolia.infura.io'
            };
            break;
        default:
            rpcUrls = {
                30: 'https://public-node.rsk.co'
            };
    }

    const chainId = import.meta.env.REACT_APP_ENVIRONMENT_CHAIN_ID;
    var selectedNetwork = {};
    selectedNetwork[parseInt(chainId)] = rpcUrls[parseInt(chainId)];

    const supportedChains = Object.keys(rpcUrls).map(Number);

    const rLogin = new window.RLogin.default({
        cacheProvider: false,
        providerOptions: {
            walletconnect: {
                package: window.rLoginWalletConnect2Provider.WalletConnect2Provider,
                options: {
                    projectId: import.meta.env.REACT_APP_RLOGIN_WALLETCONNECT2_PROJECTID,
                    chains: [parseInt(chainId, 10)],
                    showQrModal: true,
                    rpcMap: rpcUrls
                }
            },
            'custom-ledger': {
                ...window.rLoginLedgerProvider.ledgerProviderOptions,
                options: {
                    rpcUrl: rpcUrls[parseInt(chainId, 10)],
                    chainId: parseInt(chainId, 10)
                }
            },
            'custom-dcent': {
                ...window.rLoginDCentProvider.dcentProviderOptions,
                options: {
                    rpcUrl: rpcUrls[parseInt(chainId)],
                    chainId: parseInt(chainId),
                    debug: true
                }
            },
            'custom-trezor': {
                ...window.rLoginTrezorProvider.trezorProviderOptions,
                options: {
                    rpcUrl: rpcUrls[parseInt(chainId, 10)],
                    chainId: parseInt(chainId, 10),
                    manifestEmail: 'info@moneyonchain.com',
                    manifestAppUrl: 'https://moneyonchain.com/'
                }
            }
        },
        rpcUrls: selectedNetwork,
        supportedChains
    });

    return rLogin;
};

export default getRLogin;
