import SimpleStrategy from "../strategies/SimpleStrategy";

const createStrategy = (strategy, params) => {
  switch(strategy) {
    case SimpleStrategy.NAME:
    return new SimpleStrategy({...params});
  }
} 

export default createStrategy;