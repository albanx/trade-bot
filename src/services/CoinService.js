export default class CoinService {
  constructor(collection) {
    this.collection = collection;
  }

  async getCoin(name, market) {
    const coin = await this.collection.findOne({name, market});
    return coin;
  }

  async getPriceStart(name, market) {
    const coin = await this.collection.findOne({name, market});
    return coin ? coin.priceStart : 0;
  }

  async updatePrice(name, market, priceMarket, priceStart, priceAction, action) {
    this.collection.update(
      {
        name,
        market
      },
      {
        name,
        market,
        priceMarket,
        priceStart,
        priceAction,
        action,
        time: new Date()
      },
      {
        upsert: true
      }
    );
  }

  async initCoinPrice(coin, market, priceMarket) {
    const priceStart = await this.getPriceStart(coin, market);

    if (!priceStart) {
      await this.updatePrice(coin, market, priceMarket, priceMarket, priceMarket, null);
    }
  }
}
