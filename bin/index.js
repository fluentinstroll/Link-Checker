#!/usr/bin/env node

const chalk = require('chalk')
const yargs = require('yargs')
const fs = require('fs')
const { once } = require('events')
const { createReadStream } = require('fs')
const { createInterface } = require('readline')
const { argv, exit } = require('process')
const getUrls = require('get-urls')
const req = require('request')
require('events').EventEmitter.defaultMaxListeners = 11
req.maxRedirects = 11

var filename
var iFileArr = [] // an array for storing each line of the ignore file -Joy3van

const options = yargs
    .usage('Usage $0: enter filename after command, with a proper argument.')
    .alias('version', 'v') //user can enter -v or --version
    .alias('g', 'good')
    .describe('g', 'Show only good links in a file.')
    .alias('b', 'bad')
    .describe('b', 'Show only bad links in a file')
    .alias('i', 'ignore')
    .describe(
        'i',
        'Ignore links provided in another file, the path of ignore file should be after argument',
    )
    .alias('t', 'telescope')
    .describe('t', 'Read links connected to a local telescope server').argv

if (options.t) {
    var url = 'http://localhost:3000/posts/'

    req.get(
        {
            url: url,
            json: true,
            headers: {
                'User-Agent': 'request',
            },
        },
        (err, res, data) => {
            if (err) {
                console.log('Error:', err)
            } else if (res.statusCode !== 200) {
                console.log(
                    'localhost did not respond... check to see if your local telescope session is up...',
                )
            } else {
                const urls = data.map((e) => url + e.id)

                fs.writeFile(
                    'files/telescope.txt',
                    JSON.stringify(urls),
                    function (err) {
                        if (err) throw err
                    },
                )
            }
        },
    )
    //send file to be read
}

// Process the ignore file -Joy3van
if (options.i) {
    ;(async function processLineByLine() {
        try {
            const rl = createInterface({
                input: createReadStream(`${argv[4]}`),
                crlfDelay: Infinity,
            })
            /* 
            trying to add error handling for when the file doesn't exist, but it seems because it's asyncronous, 
            we cannot actually do it because the error will always be reported on the system level before we can catch it
            thinking of a way to fix this including making this function syncronous
            */
            rl.on('line', (line) => {
                if (line[0] !== '#') {
                    if (line[0] === 'h') {
                        iFileArr.push(line)
                    } else {
                        rl.close()
                    }
                }
            })

            await once(rl, 'close')
        } catch (err) {
            console.log(
                'Please check if you typed the options in a correct order',
            )
        }
    })()
}

if (options.t) {
    filename = 'files/telescope.txt'
} else {
    filename = `${argv[2]}`
}
fs.readFile(filename, (err, fileContents) => {
    try {
        var linkList = generateLinkList(fileContents) // Changed let to var because otherwise linklist variable would become undefined outside the try block -Joy3van
        linkList = Array.from(linkList)
    } catch (err) {
        console.log('The app has recieved a wrong filename.')
        console.log('Please enter a correct filename.')
        exit(1)
    }
    validateLinks(linkList)
})

const generateLinkList = (fileContents) => {
    let list
    if (options.i) {
        list = getUrls(fileContents.toString(), {
            stripWWW: false,
            exclude: iFileArr,
        }) // Set exclude option and exclude whatever link had been put in iFileArr. - Joy3van
    } else {
        list = getUrls(fileContents.toString(), {
            stripWWW: false,
        }) // Set the stripWWW option to false so it would get correct links(default is true) -Joy3van
    }
    return list
}

const validateLinks = async (links) => {
    for (const link of links) {
        await isValid(link)
    }
    console.log('=========================')
    console.log('Exiting with exit code: ' + process.exitCode)
}

const isValid = (link) => {
    return new Promise((resolve) => {
        req.head(
            link,
            {
                timeout: 1500,
            },
            function (_, res) {
                if (!res) {
                    if (!options.b && !options.g) {
                        console.log(chalk.gray(`[TIMEOUT] ${link}`))
                        process.exitCode = 2
                    }
                    return resolve()
                }

                const status = res.statusCode

                displayStatusCode(status, link)

                resolve()
            },
        )
    })
}

const displayStatusCode = (code, link) => {
    if (code === 200) {
        if (!options.b) {
            console.log(chalk.green(`[200] GOOD ${link}`))
            if (process.exitCode != 1 && process.exitCode != 2) {
                process.exitCode = 0
            }
        }
    } else if (code === 400 || code === 404) {
        if (!options.g) {
            console.log(chalk.red(`[${code}] BAD ${link}`))
            if (process.exitCode != 2) process.exitCode = 1
        }
    } else {
        if (!options.b && !options.g) {
            console.log(chalk.gray(`[${code}] UNKNOWN ${link}`))
            process.exitCode = 2
        }
    }
}
