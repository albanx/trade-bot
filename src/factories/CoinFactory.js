import CoinModel from '../models/CoinModel';

const createCoin = ({code, name, supply}) => new CoinModel(code, name, supply);

export default createCoin;
