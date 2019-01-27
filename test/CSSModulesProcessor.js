const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");

/**
 * TODO: Consider using css-loader/lib/getLocalIdent in the future
 * (not usable at the moment due to incompatible postcss version)
 *
 * Emulates localIdentName: "[local]--[hash:base64:5]"
 */
function getLocalIdent(filePath, localName) {
    const content = `${path.relative(root, filePath).replace(/\\/g, "/")}+${localName}`;
    const hash = crypto.createHash("md5")
        .update(content)
        .digest("base64")
        .replace(/[^a-z0-9]/gi, "")
        .substr(0, 5);
    return `${localName}--${hash}`;
}

module.exports = {
    process(src, filename) {
        const identifiers = findExportedIdentifiers(filename);
        const content = identifiers.map(i => `${formatKey(i)}: "${getLocalIdent(filename, i)}"`).join(",");
        return `module.exports = { ${content} };`;
    },
    getLocalIdent,
};

/**
 * Attempts to find the identifiers of css-module stylesheets by parsing their type definitions.
 * Can parse type definitions as created by scripts/create-css-declaration-files.js - must be updated if the format changes.
 * If the definition is not found or cannot be parsed, returns an empty array.
 */
function findExportedIdentifiers(filename) {
    const definitionPath = `${filename}.d.ts`;

    try {
        const definitionContent = fs.readFileSync(definitionPath, "utf8");
        const matches = /\{([^}]+)\}/.exec(definitionContent);

        return matches[1]
            .trim()
            .split("\n")
            .map(l => l.trim().replace(/"/g, "").replace(/:.*/, ""));
    } catch (e) {
        return [];
    }
}

function formatKey(key) {
    return /^[a-z_][a-z0-9_]*$/i.test(key) ? key : `"${key}"`;
}
