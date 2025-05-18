const path = require('path');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Encuentra la regla de source-map-loader
            const sourceMapRule = webpackConfig.module.rules.find(
                rule => rule.use && rule.use.some(u => u.loader && u.loader.includes('source-map-loader'))
            );

            if (sourceMapRule) {
                // Excluye react-datepicker de source-map-loader
                sourceMapRule.exclude = [
                    /node_modules[\\/]react-datepicker/,
                ];
            }

            return webpackConfig;
        }
    }
};
