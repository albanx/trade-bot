export default class CoinService {
  constructor(collection) {
    this.collection = collection;
  }

  async getPriceStart(name, market) {
    const coin = await this.collection.findOne({ name, market });
    return coin ? coin.priceStart : 0;
  }

  async updatePrice(coin, priceMarket, priceStart, market, action) {
    console.log(`updateCoinPrice::${priceStart}, ${priceMarket}, ${market}`);

    this.collection.update(
      {
        name: coin,
        market: market
      },
      {
        name: coin,
        market: market,
        priceMarket: priceMarket,
        priceStart: priceStart,
        action: action,
        time: new Date()
      },
      {
        upsert: true
      }
    );
  }
}
