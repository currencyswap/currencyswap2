module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        "no-console": "off",
        "indent": "off", //[ "error", 4 ],
        "linebreak-style": "off",//[ "error", "unix" ],
        "quotes": [ "error", "single" ],
        "semi": [ "error", "always" ]
    }
};
