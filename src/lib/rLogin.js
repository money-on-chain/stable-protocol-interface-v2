
const getRLogin = (port) => {
    let rpcUrls = {};

    if (parseInt(port) === 31) {
        rpcUrls = {
            31: 'https://public-node.testnet.rsk.co'
        };
    }
    if (parseInt(port) === 30) {
        rpcUrls = {
            30: 'https://public-node.rsk.co'
        };
    }

    const chainId = process.env.REACT_APP_ENVIRONMENT_CHAIN_ID;
    var selectedNetwork = {};
    selectedNetwork[parseInt(chainId)] = rpcUrls[parseInt(chainId)];

    const supportedChains = Object.keys(rpcUrls).map(Number);

    const rLogin = new window.RLogin.default({
        cacheProvider: false,
        providerOptions: {
            walletconnect: {
                package: window.rLoginWalletConnect2Provider.WalletConnect2Provider,
                options: {
                    projectId: process.env.REACT_APP_RLOGIN_WALLETCONNECT2_PROJECTID,
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
