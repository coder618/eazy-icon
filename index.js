const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");

// Function to minify a single CSS file
function minifyCSS(inputFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(inputFilePath, "utf8", (err, data) => {
            if (err) {
                reject(`Error reading file ${inputFilePath}: ${err}`);
                return;
            }

            const output = new CleanCSS().minify(data);

            if (output.errors.length > 0) {
                reject(`Errors during minification of ${inputFilePath}: ${output.errors}`);
                return;
            }

            fs.writeFile(outputFilePath, output.styles, "utf8", (err) => {
                if (err) {
                    reject(`Error writing file ${outputFilePath}: ${err}`);
                } else {
                    resolve(`Minified CSS written to ${outputFilePath}`);
                }
            });
        });
    });
}

// Function to minify multiple CSS files
async function minifyMultipleCSS(inputFilePaths, outputDirectory) {
    for (const inputFilePath of inputFilePaths) {
        const fileName = path.basename(inputFilePath, ".css");
        const outputFilePath = path.join(outputDirectory, `${fileName}.min.css`);
        try {
            const result = await minifyCSS(inputFilePath, outputFilePath);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
}

// Example usage: list of CSS files to be minified
const inputFilePaths = ["./thin.css", "./regular.css", "./bold.css", "./fill.css"];
const outputDirectory = "./";

minifyMultipleCSS(inputFilePaths, outputDirectory);
