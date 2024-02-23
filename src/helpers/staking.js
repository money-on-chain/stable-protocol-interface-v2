import settings from '../settings/settings.json';

function loadTokenMap() {

    const tMap = {}
    tMap['TF'] = ['TF']
    return tMap
}

const VERY_HIGH_NUMBER = 100000000000;

const tokenMap = loadTokenMap()
const tokenStake = () => Object.keys(tokenMap);

export {
  tokenStake
};
