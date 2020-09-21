#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");

/*TODO: add requirement to add filename, 
add logic for testing urls */

const options = yargs
 .usage("Usage: -n <name>")
 //.option("*.t", { alias: "name", describe: "Your name", type: "string", demandOption: true })
 .argv;

const greeting = `Hello, ${options.name}!`;

console.log(greeting);