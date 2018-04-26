import blessed from 'blessed';
import chalk from 'chalk';

const DEFAULT_SCROLL_OPTIONS = {
  scrollable: true,
  input: true,
  alwaysScroll: true,
  scrollbar: {
    ch: " ",
    inverse: true
  },
  keys: true,
  vi: true,
  mouse: true
};
export default class Dashboard {
  constructor(options) {
    this.color = options.color || "green";
    this.screen = blessed.screen({
      title: options.title || 'Dashboard',
      smartCSR: true,
      dockBorders: false,
      fullUnicode: true,
      autoPadding: true
    });

    // Quit on Escape, q, or Control-C.
    this.screen.key(['escape', 'q', 'C-c'], function (ch, key) {
      return process.exit(0);
    });

    this.header = ["ID", "Coin", "Start Price", "Exchange Price / x amount", "Order Price / x amount", "Diff / x amount", "%", "Mode"];
    this.headerOrder = ["Coin", "Exchange", "Order Id", "Status", "Price", "Order"];
    this.headerPrediction = ["ID", "Coin", "Exchange", "Next Order", "Amount"];
    this.layoutScriptLog();
    this.layoutPriceMonitor();
    this.layoutOrders();
    this.layoutPrediction();
    this.screen.render();
  }

  addPriceMonitorRows(rows) {
    this.moduleTable.setData([
      this.header,
      ...rows
    ]);
    this.moduleTable.screen.render();
  }

  addRowOrders(rows) {
    this.orderTable.setData([
      this.headerOrder,
      ...rows
    ]);
    this.orderTable.screen.render();
  }

  addRowNextAction(rows) {
    this.predictionTable.setData([
      this.headerPrediction,
      ...rows
    ]);
    this.predictionTable.screen.render();
  }

  now() {
    const date = new Date();
    const d = [date.getFullYear(), ('00' + (date.getMonth() + 1)).slice(-2), ('00' + date.getDate()).slice(-2)];
    const t = [('00' + date.getHours()).slice(-2), ('00' + date.getMinutes()).slice(-2), ('00' + date.getSeconds()).slice(-2)]
    return `${d.join('-')} ${t.join(':')}`;
  }

  setPriceMonitorLabel(label) {
    this.modulesMenu.setLabel(chalk.yellow(label));
  }

  log(...params) {
    this.logText.log(chalk.yellowBright(this.now(), ...params));
  }

  warning(...params) {
    const warning = chalk.keyword('orange');
    this.logText.log(warning(this.now(), 'Warning', ...params));
  }

  error(...params) {
    this.logText.log(chalk.bold.red(...params));
  }

  layoutPriceMonitor() {
    this.modulesMenu = blessed.listbar({
      label: "Price Monitor",
      mouse: true,
      tags: true,
      width: "60%",
      height: "66%",
      left: "0%",
      top: "36%",
      border: {
        type: "line"
      },
      padding: 1,
      style: {
        fg: -1,
        border: {
          fg: this.color
        },
        prefix: {
          fg: -1
        },
        item: {
          fg: "white"
        },
        selected: {
          fg: "black",
          bg: this.color
        }
      },
      autoCommandKeys: true
    });

    this.moduleTable = blessed.table({
      ...DEFAULT_SCROLL_OPTIONS,
      parent: this.modulesMenu,
      height: "100%",
      width: "100%-5",
      padding: {
        top: 2,
        right: 1,
        left: 1
      },
      data: [this.header]
    });

    this.screen.append(this.modulesMenu);
  }

  layoutPrediction() {
    this.prediction = blessed.box({
      label: "Next Order",
      tags: true,
      padding: 1,
      width: "40%",
      height: "36%",
      left: "60%",
      top: "0%",
      border: {
        type: "line"
      },
      style: {
        fg: -1,
        border: {
          fg: this.color
        }
      }
    });

    this.predictionTable = blessed.table({
      ...DEFAULT_SCROLL_OPTIONS,
      parent: this.prediction,
      height: "100%",
      width: "100%-5",
      align: "left",
      data: [this.headerPrediction]
    });


    this.screen.append(this.prediction);

  }


  layoutOrders() {
    this.orders = blessed.box({
      label: "Orders Log",
      tags: true,
      padding: 1,
      width: "40%",
      height: "66%",
      left: "60%",
      top: "36%",
      border: {
        type: "line"
      },
      style: {
        fg: -1,
        border: {
          fg: this.color
        }
      }
    });

    this.orderTable = blessed.table({
      ...DEFAULT_SCROLL_OPTIONS,
      parent: this.orders,
      height: "100%",
      width: "100%-5",
      align: "left",
      padding: 1,
      data: [this.headerOrder]
    });

    this.screen.append(this.orders);
  }

  layoutScriptLog() {
    this.logBox = blessed.box({
      label: "Script log",
      padding: 1,
      width: "60%",
      height: "36%",
      left: "0%",
      top: "0%",
      border: {
        type: "line"
      },
      style: {
        fg: -1,
        border: {
          fg: this.color
        }
      }
    });

    this.logText = blessed.log({
      ...DEFAULT_SCROLL_OPTIONS,
      parent: this.logBox,
      tags: true,
      width: "100%-5"
    });

    this.screen.append(this.logBox);
    this.mapNavigationKeysToScrollLog();
  }


  mapNavigationKeysToScrollLog() {
    this.screen.key(["pageup"], () => {
      this.logText.setScrollPerc(0);
      this.logText.screen.render();
    });
    this.screen.key(["pagedown"], () => {
      // eslint-disable-next-line no-magic-numbers
      this.logText.setScrollPerc(100);
      this.logText.screen.render();
    });
    this.screen.key(["up"], () => {
      this.logText.scroll(-1);
      this.logText.screen.render();
    });
    this.screen.key(["down"], () => {
      this.logText.scroll(1);
      this.logText.screen.render();
    });
  }
}


