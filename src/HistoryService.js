export default class HistoryService {
  constructor(collection, threshold) {
    this.co = collection;
    this.threshold = threshold;
  }

  addToHistory(coin, price, market, action) {
    this.co.insert({ coin, price, market, action, time: new Date() });
  }

  async findNextAction(coin, market, percentChange) {
    const last = await this.co.findOne(
      { coin, market },
      { sort: { _id: -1 }, limit: 1 }
    );

    if (Math.abs(percentChange) > this.threshold) {
      let nextActionBasedOnMarket = percentChange > 0 ? 'sell' : 'buy';

      if (
        !last || !last.action || 
        (last.action === 'buy' && nextActionBasedOnMarket === 'sell') ||
        (last.action === 'sell' && nextActionBasedOnMarket === 'buy')
        
      ) {
        return nextActionBasedOnMarket;
      }
    }

    return null;
  }
}
