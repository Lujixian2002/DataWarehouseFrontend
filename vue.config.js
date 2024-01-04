const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    devServer: {
        client: {
            overlay: {
                runtimeErrors: false,
            },
        },
    },
    transpileDependencies: true
})