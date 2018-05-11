# JsTradeBot
JsTradeBot is a simple Javascript bot, written in ES6, to trade automatically crypto coin.
It is based on simple strategies, it monitors the coin prices and tries to 
make relative gains.

### Tech Stack
- ES6
- Async/Await
- MongoDB as permanent store
- NodeJS for running via cmd
- Jest for unit tests

### Strategies
Current the bot implements 3 strategies, 
- Simple, trades within give limits in absolute values
- DiffBased trades within give limits in percent values
- PeakDetector, trades only when it detects maximum value or minimum value of the coin


### Directory Layout
