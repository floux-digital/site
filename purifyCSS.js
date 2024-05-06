const purify = require('purify-css');

const content = ['*.html'];
const css = ['main.css'];

const options = {
    output: 'main.min.css',
    minify: true,
    info: true
};

purify(content, css, options, function (purifiedAndMinifiedResult){
    console.log(purifiedAndMinifiedResult);
});