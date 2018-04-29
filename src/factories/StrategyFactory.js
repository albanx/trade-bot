import SimpleStrategy from '../strategies/SimpleStrategy';
import DiffBasedStrategy from '../strategies/DiffBasedStrategy';
import PeakDetectorStratety from '../strategies/PeakDetectorStrategy';

const createStrategy = (strategy, params) => {
  switch (strategy) {
    case SimpleStrategy.NAME:
      return new SimpleStrategy(params);

    case DiffBasedStrategy.NAME:
      return new DiffBasedStrategy(params);
   
    case PeakDetectorStratety.NAME:
      return new PeakDetectorStratety(params);
  }
};

export default createStrategy;
