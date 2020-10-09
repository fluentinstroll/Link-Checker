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

TODO:
- make the script show the name when showing the version

ERRORS:
- MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 pipe listeners added to [Request]. Use emitter.setMaxListeners() to increase limit.
    -- tried to fix by setting defaultMaxListeners to 11 since according to the request dev this is a problem with website redirects but COULD be memory leak
- seemingly randomly the app spits out incorrect status codes even though the site works
*/

req.maxRedirects = 11;

const options = yargs
    .usage("Usage $0: enter filename after command, with ")
    .demandCommand(1)
    .alias('version', 'v') //user can enter -v or --version
    .alias('g', 'good')
    .describe('g', 'Show only good links in a file.')
    .alias('b', 'bad')
    .describe('b', 'Show only bad links in a file')
    .argv;



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

function validateLinks(data) {

    for (const link of data) {
        isValid(link)
    }
    
}

const isValid = (link) => {
    

    return new Promise((resolve) => {
        req.head(link, {
            timeout: 1500
        }, function (_, res) {
            if (!res) {
                if (!options.b && !options.g) {
                    console.log(chalk.gray(`[TIMEOUT] ${link}`));
                }
                return resolve();
            }

            const status = res.statusCode;
            if (status === 200) {
                if (!options.b) {
                    console.log(chalk.green(`[200] GOOD ${link}`));
                }
            } else if (status === 400 || status === 404) {
                if (!options.g) {
                    console.log(chalk.red(`[${status}] BAD ${link}`));
                }
            } else {
                if (!options.b && !options.g) {
                    console.log(chalk.gray(`[${status}] UNKNOWN ${link}`));
                }
            }

            resolve();
        });
    })

}