import SimpleStrategy from '../strategies/SimpleStrategy';
import DiffBasedStrategy from '../strategies/DiffBasedStrategy';

const createStrategy = (strategy, params) => {
  switch (strategy) {
    case SimpleStrategy.NAME:
      return new SimpleStrategy({ ...params });

    case DiffBasedStrategy.NAME:
      return new DiffBasedStrategy({ ...params });
  }
};

export default createStrategy;
