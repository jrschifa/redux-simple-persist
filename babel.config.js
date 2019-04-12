module.exports = function (api) {
    api.cache.forever();

    return {
        presets: [
            ["@babel/preset-env", {
                "modules": false,
                "targets": {
                    "browsers": ["last 2 versions", "ie >= 11"]
                }
            }],                    
            "@babel/preset-typescript"
        ],
        plugins: [
            ["@babel/plugin-transform-runtime"],
            ["@babel/plugin-transform-modules-commonjs"]
        ]
    }
}