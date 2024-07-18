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

const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(timestamp)
}


export {
  tokenStake,
  pendingWithdrawalsFormat,
  formatTimestamp
};
