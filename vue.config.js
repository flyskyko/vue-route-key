module.exports = {
    configureWebpack: {
        output: {
            libraryExport: 'default'
        },
        externals: ['vue-router']
    }
}
