#!/usr/bin/env node

const chalk = require("chalk");
const yargs = require("yargs");
const fs = require("fs");
const {
    once
} = require('events');
const {
    createReadStream
} = require('fs');
const {
    createInterface
} = require('readline');
const {
    argv,
    exit
} = require("process");
const getUrls = require('get-urls');
const req = require('request');
require('events').EventEmitter.defaultMaxListeners = 11;

req.maxRedirects = 11;

var iFileArr = []; // an array for storing each line of the ignore file -Joy3van

const options = yargs
    .usage("Usage $0: enter filename after command, with a proper argument.")
    .demandCommand(1)
    .alias('version', 'v') //user can enter -v or --version
    .alias('g', 'good')
    .describe('g', 'Show only good links in a file.')
    .alias('b', 'bad')
    .describe('b', 'Show only bad links in a file')
    .alias('i', 'ignore')
    .describe('i', 'Ignore links provided in another file, the path of ignore file should be after argument')
    .argv;

// Process the ignore file -Joy3van
if (options.i) {
    (async function processLineByLine() {
        try {
            const rl = createInterface({
                input: createReadStream(`${argv[4]}`),
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                if (line[0] !== '#') {
                    if (line[0] === 'h') {
                        iFileArr.push(line);
                    } else {
                        rl.close();
                    }
                }
            });

            await once(rl, 'close');

        } catch (err) {
            console.log('Please check if you typed the options in a correct order');
        }
    })();

}

fs.readFile(`${argv[2]}`, (err, data) => {
    try {
        var linklist = generateLinkList(data); // Changed let to var because otherwise linklist variable would become undefined outside the try block -Joy3van
        linklist = Array.from(linklist);
    } catch (err) {
        console.log("The app has recieved a wrong filename.")
        console.log("Please enter a correct filename.")
        exit(1);
    }
    validateLinks(linklist)
})



const generateLinkList = (data) => {
    let linklist = separateLinks(data);
    return linklist;
}

const separateLinks = (data) => {
    let list;
    if (options.i) {
        list = getUrls(data.toString(), {
            stripWWW: false,
            exclude: iFileArr
        }); // Set exclude option and exclude whatever link had been put in iFileArr. - Joy3van
    } else {
        list = getUrls(data.toString(), {
            stripWWW: false
        }); // Set the stripWWW option to false so it would get correct links(default is true) -Joy3van
    }
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
                return resolve();
            }

            const status = res.statusCode;
            if (status === 200) {
                if (!options.b) {
                    console.log(chalk.green(`[200] GOOD ${link}`));
                    if (process.exitCode != 1 && process.exitCode != 2) {
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

            resolve();
        });
    })

}