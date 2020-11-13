# Link-Checker

### An app to let people check URLs and find out if they actually work!

### This app uses node, therefore you need to have the latest version of node installed on your computer.

## Features included

- Colourizing output. Good URLs should be printed in green, bad URLs in red, and unknown URLs in gray
- Running the tool with the v or version argument should print the name of the tool and its version
- Supports both --version and -v command line arguments
- Use the -g and -b arguments after you enter the filename in order to only print good or bad links!
- The app will also let you know what your exit code is after it's finished (0 for only good links, 1 for at least 1 bad link, and 2 for at least 1 unknown link)
- Use the -i argument to ignore certain links in a file!

## To use:

### In terminal:

- navigate to the Link-Checker folder: `cd Link-Checker`
- install Link Checker: `npm install . -g`
- run the app: `linkchecker <path-to-file>`

### or...

- navigate to the src folder: `cd Link-Checker/src`
- `node index.js <path-to-file>`

### To ignore links in a file

`linkchecker <path-to-file> -i <path-to-ignore-file>`

### To see good, bad, or all links

Good: `linkchecker -g <path-to-file>`
Bad: `linkchecker -b <path-to-file>`
All: `linkchecker <path-to-file>`

## Used Libraries

- yargs, for using arguments in the cli program: https://github.com/yargs/yargs
- get-urls, for separating links in a file: https://github.com/sindresorhus/get-urls
- chalk, for adding colour to the good, bad, and unknown links: https://github.com/chalk/chalk
- request, for requesting access to websites and grabbing the status code: https://github.com/request/request
