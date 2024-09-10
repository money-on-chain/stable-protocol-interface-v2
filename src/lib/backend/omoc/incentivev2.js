import { getGasPrice } from '../utils';


const claimV2 = async (interfaceContext, signDataResponse, onTransaction, onReceipt) => {

    const { web3, account } = interfaceContext;
    const dContracts = window.dContracts;
    const IncentiveV2 = dContracts.contracts.IncentiveV2;

    const signature = signDataResponse;
    const r = '0x' + signature.slice(2).slice(0, 64);
    const s = '0x' + signature.slice(2).slice(64, 128);
    const v = Number.parseInt(signature.slice(2).slice(128), 16);

    const estimateGas = await IncentiveV2.methods
        .claimV2([v], [r], [s])
        .estimateGas({ from: account, value: '0x'  });

    const receipt = IncentiveV2.methods
        .claimV2([v], [r], [s])
        .send(
            {
                from: account,
                value: 0,
                gasPrice: await getGasPrice(web3),
                gas: estimateGas,
                gasLimit: estimateGas
            }
        )
        .on('transactionHash', onTransaction)
        .on('receipt', onReceipt);

    return receipt;
};


export {
    claimV2
};
