import PeakDetectorStrategy from "../../src/strategies/PeakDetectorStrategy";
import coinExchangeModel from '../__mocks__/coinExchangeModel';
import OrderService from "../../src/services/OrderService";

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

describe('PeakDetectorStrategy', () => {
  const instance = new PeakDetectorStrategy({threshold: 20, prices: [], maxLimit: 7});

  beforeEach(() => {
    instance.prices = [];
  });

  test('get NAME', () => {
    expect(PeakDetectorStrategy.NAME).toBe('peak');
  });

  test('create an instance', () => {
    expect(instance instanceof PeakDetectorStrategy).toBe(true);
  });

  test('getPriceNextOrder', () => {
    const price = instance.getPriceNextOrder(coinExchangeModel, OrderService.ORDER_SELL);
    expect(price).toEqual(coinExchangeModel.priceExchange);
  });

  test('isOrderPossible', () => {
    const isOrder = instance.isOrderPossible(coinExchangeModel, OrderService.ORDER_SELL);
    expect(isOrder).toEqual(false);
  });

  test('isSellPossible when prices goes up or down', () => {
    instance.addPrice(122);
    instance.addPrice(123);
    instance.addPrice(125);
    instance.addPrice(121);
    instance.addPrice(141);
    instance.addPrice(145);
    instance.addPrice(149);
    instance.addPrice(155);

    let diff = 155 - coinExchangeModel.priceOrder;
    expect(instance.isIncrementing(7)).toEqual(true);
    expect(instance.isSellPossible(diff)).toEqual(false);

    //price going down within threshold
    instance.addPrice(155);
    instance.addPrice(154);
    instance.addPrice(153);
    instance.addPrice(152);
    instance.addPrice(151);
    instance.addPrice(150);
    instance.addPrice(149);

    diff = 149 - coinExchangeModel.priceOrder;
    expect(instance.isSellPossible(diff)).toEqual(true);
    expect(instance.isIncrementing(6)).toEqual(false);
  });

  test('isIncrementing', () => {
    instance.addPrice(122);
    instance.addPrice(123);
    instance.addPrice(125);
    instance.addPrice(123);
    const bool = instance.isIncrementing(15);
    expect(bool).toEqual(true);
  });

  test('isDecrementing', () => {
    instance.addPrice(125);
    instance.addPrice(124);
    instance.addPrice(124);
    instance.addPrice(121);
    const bool = instance.isIncrementing(7);
    expect(bool).toEqual(false);
  });
});
