var path = require("path");
var ClosureExposer = require("../");
module.exports =  {
        entry: "./entry.js",
        output: {
            path: path.join(__dirname, "js"),
            filename: "output.js"
        },
        plugins: [
            new ClosureExposer()
        ]
};