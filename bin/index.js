#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");
const fs = require("fs");
const br = require('binary-reader');
const { argv } = require("process");

/*TODO: 
add logic for testing urls: 
- if file cannot be found, error (use fs)
- else, add logic for determining if urls 404 */

const options = yargs
 .usage("Usage: enter filename after command")
 .demandCommand(1)
 .alias('version', 'v') //user can enter -v or --version
 .argv;

fs.readFile(`${argv[2]}`, (err, data) => {
    if (err) throw err;
    console.log(data.toString());
})