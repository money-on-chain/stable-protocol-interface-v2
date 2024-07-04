function loadTokenMap() {

    const tMap = {}
    tMap['TG'] = ['TG']
    return tMap
}

const tokenMap = loadTokenMap()
const tokenStake = () => Object.keys(tokenMap);


const pendingWithdrawalsFormat = (delaymachine) => {
    const { ids, amounts, expirations } = delaymachine.getTransactions
    const withdraws = [];
    for (let i = 0; i < ids.length; i++) {
        withdraws.push({
            id: ids[i],
            amount: amounts[i],
            expiration: expirations[i]
        });
    }
    return withdraws;
}


export {
  tokenStake,
  pendingWithdrawalsFormat
};
