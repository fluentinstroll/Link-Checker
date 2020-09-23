# Link-Checker
An app to let people check URLs and find out if they actually work!

To use:
- simply navigate to the bin folder and write node index.js <filename>

Features included:
- colourizing output. Good URLs should be printed in green, bad URLs in red, and unknown URLs in gray 
- running the tool with the v or version argument should print the name of the tool and its version
- supports both --version and -v command line args

Libraries used by this script:
- yargs: https://github.com/yargs/yargs
- get-urls: https://github.com/sindresorhus/get-urls
- chalk: https://github.com/chalk/chalk
- request: https://github.com/request/request