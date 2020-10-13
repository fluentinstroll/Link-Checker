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

req.maxRedirects = 11;

const options = yargs
    .usage("Usage $0: enter filename after command, with a proper argument.")
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

    validateLinks(linklist)
})

const generateLinkList = (data) => {
    let linklist = separateLinks(data);
    return linklist;
}

const separateLinks = (data) => {
    let list = getUrls(data.toString());
    return list;
}

const validateLinks = async (data) => {
    for (const link of data) {
        await isValid(link)
    }
    console.log("=========================");
    console.log("Exiting with exit code: " + process.exitCode);
}

const isValid = (link) => {


    return new Promise((resolve) => {
        req.head(link, {
            timeout: 1500
        }, function (_, res) {
            if (!res) {
                if (!options.b && !options.g) {
                    console.log(chalk.gray(`[TIMEOUT] ${link}`));
                    process.exitCode = 2;
                }
                return resolve(process.exitCode);
            }

            const status = res.statusCode;
            if (status === 200) {
                if (!options.b) {
                    console.log(chalk.green(`[200] GOOD ${link}`));
                    if (process.exitCode != 1 && process.exitCode != 2){
                        process.exitCode = 0;
                    }
                }
            } else if (status === 400 || status === 404) {
                if (!options.g) {
                    console.log(chalk.red(`[${status}] BAD ${link}`));
                    if (process.exitCode != 2)
                        process.exitCode = 1;
                }
            } else {
                if (!options.b && !options.g) {
                    console.log(chalk.gray(`[${status}] UNKNOWN ${link}`));
                    process.exitCode = 2;
                }
            }

            resolve(process.exitCode);
        });
    })

}