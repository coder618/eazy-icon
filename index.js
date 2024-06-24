const fs = require("fs");
const path = require("path");
const sass = require("sass");
const CleanCSS = require("clean-css");

const inputDir = "./scss"; // Directory containing your SCSS files
const outputDir = "./css"; // Directory to output your minified CSS files

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to compile SCSS to CSS and then minify it
const compileAndMinify = (filePath) => {
    sass.render({ file: filePath }, (err, result) => {
        if (err) {
            console.error(`Error compiling ${filePath}:`, err);
            return;
        }

        const minified = new CleanCSS().minify(result.css.toString());
        if (minified.errors.length > 0) {
            console.error(`Error minifying ${filePath}:`, minified.errors);
            return;
        }

        const outputFilePath = path.join(outputDir, path.basename(filePath, ".scss") + ".min.css");
        fs.writeFile(outputFilePath, minified.styles, (err) => {
            if (err) {
                console.error(`Error writing ${outputFilePath}:`, err);
            } else {
                console.log(`Successfully compiled and minified ${filePath} to ${outputFilePath}`);
            }
        });
    });
};

// Read the input directory and process each SCSS file
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error(`Error reading directory ${inputDir}:`, err);
        return;
    }

    files.forEach((file) => {
        const filePath = path.join(inputDir, file);
        if (path.extname(file) === ".scss") {
            compileAndMinify(filePath);
        }
    });
});
