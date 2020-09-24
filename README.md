# Link-Checker
An app to let people check URLs and find out if they actually work!

This app uses node, therefore you need to have the latest version of node installed on your computer.

To use:

In terminal:

- navigate to the Link-Checker folder (cd Link-Checker)
- install Link Checker (npm install . -g)
- run the app (linkchecker <path-to-file>)

or...
- navigate to the src folder (cd Link-Checker/src)
- node index.js <path-to-file>

Features included:
- colourizing output. Good URLs should be printed in green, bad URLs in red, and unknown URLs in gray 
- running the tool with the v or version argument should print the name of the tool and its version
- supports both --version and -v command line args

Libraries used by this script:
- yargs, for using arguments int he cli program: https://github.com/yargs/yargs
- get-urls, for separating links in a file: https://github.com/sindresorhus/get-urls
- chalk, for adding colour to the good, bad, and unknown links: https://github.com/chalk/chalk
- request, for requesting access to websites and grabbing the status code: https://github.com/request/request
