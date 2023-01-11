import settings from '../settings/settings.json';

const tokenMap = {
    "CA_0": ["TC", "TP_0", "TP_1"],
    "CA_1": ["TC", "TP_0", "TP_1"],
    "TC": ["CA_0", "CA_1"],
    "TP_0": ["CA_0", "CA_1"],
    "TP_1": ["CA_0", "CA_1"]
}

const tokenExchange = () => Object.keys(tokenMap);
const tokenReceive = (tExchange) => tokenMap[tExchange];

export {
    tokenExchange,
    tokenReceive
}