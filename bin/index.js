#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");

/*TODO: 
add logic for testing urls: 
- if file cannot be found, error (use fs)
- else, add logic for determining if urls 404 */

const options = yargs
 .usage("Usage: enter filename after command")
 .demandCommand(1)
 .alias('version', 'v') //user can enter -v or --version
 //.option("*.t", { alias: "name", describe: "Your name", type: "string", demandOption: true })
 .argv;

const greeting = `Hello, ${commmand}!`;

console.log(greeting);