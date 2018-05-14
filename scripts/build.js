import webpack from 'webpack';
import webpackConfig from '../config/webpack.config';

webpack(webpackConfig).run((err, stats) => {
  if (err) {
    return new Error('Webpack compilation errors');
  }

  console.info(stats.toString());
  if (stats.hasErrors()) {
    return new Error('Webpack compilation errors');
  }

});
