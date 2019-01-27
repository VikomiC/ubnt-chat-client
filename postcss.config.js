const path = require("path");

module.exports = {
    plugins: [
        require("postcss-partial-import")({
            path: [
                path.join(__dirname, "src"),
            ],
        }),
        require("postcss-advanced-variables"),
        require("postcss-nested"),
        require("postcss-property-lookup"),
        require("postcss-calc"),
        require("postcss-functions")({
            functions: {
                
            }
        }),
        require("autoprefixer"),
    ],
};
