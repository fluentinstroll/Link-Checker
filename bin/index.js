#!/usr/bin/env node

const chalk = require("chalk");
const yargs = require("yargs");
const fs = require("fs");
const {
    argv,
    exit
} = require("process");
const getUrls = require('get-urls');
const req = require('request');
require('events').EventEmitter.defaultMaxListeners = 11;

/*
DONE:
- script now can get text from file and display it
- user must add an argument
- script makes sure the file exists (kinda)
- user can enter --version or -v
- tests each line
- display error codes and colours 


ERRORS:
- MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 pipe listeners added to [Request]. Use emitter.setMaxListeners() to increase limit.
    -- tried to fix by setting defaultMaxListeners to 11 since according to the request dev this is a problem with website redirects but COULD be memory leak
- seemingly randomly the app spits out incorrect status codes even though the site works
*/

req.maxRedirects = 11;

const options = yargs
    .usage("Usage $0: enter filename after command")
    .demandCommand(1)
    .alias('version', 'v') //user can enter -v or --version
    .argv;

if (argv[2] == '-v' || argv[2] == '--version') {
    console.log("Link Checker v0.1");
    exit;
}

fs.readFile(`${argv[2]}`, (err, data) => {
    if (err) throw err;
    let linklist = generateLinkList(data);
    linklist = Array.from(linklist);
    validateLinks(linklist);
})

const generateLinkList = (data) => {
    let linklist = separateLinks(data);
    return linklist;
}

const separateLinks = (data) => {
    let list = getUrls(data.toString());
    return list;
}

async function validateLinks(data) {
    for await (const url of data) {
        isValid(url)
    }
}

const isValid = (url) => {
    return new Promise((resolve) => {
        req.head(url, {
            timeout: 1500
        }, function (_, res) {
            if (!res) {
                console.log(chalk.gray(`[ETIMEOUT] ${url}`));
                return resolve();
            }

            const status = res.statusCode;
            if (status === 200) {
                console.log(chalk.green(`[200] GOOD ${url}`));
            } else if (status === 400 || status === 404) {
                console.log(chalk.red(`[${status}] BAD ${url}`));
            } else {
                console.log(chalk.gray(`[${status}] UNKNOWN ${url}`));
            }

            resolve();
        });
    })
}