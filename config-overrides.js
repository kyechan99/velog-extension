const {
    override,
    overrideDevServer,
    addWebpackPlugin
} = require("customize-cra");

const CopyPlugin = require('copy-webpack-plugin');
const RewireMultipleEntry = require('react-app-rewire-multiple-entry');

const multipleEntry = RewireMultipleEntry([
    {
        entry: 'src/popup/index.tsx',
        template: 'public/popup.html',
        outPath: '/popup.html'
    },
    {
        entry: 'src/page/index.tsx',
        template: 'public/index.html',
        outPath: '/index.html'
    }
]);

const devServerConfig = () => config => {
    return {
        ...config,
        writeToDisk: true
    }
}

const copyPlugin = new CopyPlugin({
    patterns: [
        { from: 'public', to: '' },
        { from: 'src/background.js', to: '' }
    ]
})

module.exports = {
    webpack: override(
        addWebpackPlugin(
            copyPlugin
        ),
        multipleEntry.addMultiEntry,
    ),
    devServer: overrideDevServer(
        devServerConfig()
    )
};
    