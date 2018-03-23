export default class CoinPriceService {
  constructor(store) {
    this.store = store;
  }

  async getCoinPrices() {
    const list = await this.store.find({active: 1});
    return list.toArray();
  }

  async setCoinStartPrice(providerObj, price = 0) {
    const provider = providerObj.getName();
    const coin = provider.getCoin().getCode();
    if (price === 0) {
      price = await provider.getCoinPrice();
    }

    await this.store.saveCoinStartPrice({coin, provider}, price);
  }

  async getCoin(name, market) {
    const coin = await this.collection.findOne({name, market});
    return coin;
  }

  async getPriceStart(name, market) {
    const coin = await this.collection.findOne({name, market});
    return coin ? coin.priceStart : 0;
  }

  async savePriceModel(priceModel) {
    const coin = priceModel.getCoin();
    const provider = priceModel.getProvider();
    const baseCoin = priceModel.getBaseCoin();
    const priceStart = priceModel.getPriceStart();
    const priceOrder = priceModel.getPriceOrder();
    const lastUpdate = new Date();

    this.store.update(
      {
        coin,
        provider
      },
      {
        coin,
        provider,
        baseCoin,
        priceStart,
        priceOrder,
        lastUpdate
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
