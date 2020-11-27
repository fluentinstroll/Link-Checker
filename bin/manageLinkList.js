const isValid = require('./isValid')
const getUrls = require('get-urls')

const generateLinkList = (fileContents, iFileArr, ignore = true) => {
    let list
    if (ignore) {
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

const validateLinks = async (links, option = '') => {
    for (const link of links) {
        let currLink = await isValid.isValid(link, option)
        console.log(currLink)
    }
    console.log('=========================')
    console.log('Exiting with exit code: ' + process.exitCode)
}

module.exports = { generateLinkList, validateLinks }
