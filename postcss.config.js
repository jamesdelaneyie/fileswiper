const tailwindcss = require("tailwindcss");

module.exports = {
    plugins: [
        //'postcss-import': {},
        //'tailwindcss/nesting': 'postcss-nesting',
        tailwindcss("./tailwind.config.js"),
        
    ]
};