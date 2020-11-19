const req = require('request')
const chalk = require('chalk')

const isValid = (link, option = '') => {
    return new Promise((resolve) => {
        req.head(
            link,
            {
                timeout: 1500,
            },
            function (_, res) {
                if (!res) {
                    if (option != 'b' && option != 'g') {
                        process.exitCode = 2
                        return resolve(chalk.gray(`[TIMEOUT] ${link}`))
                    }
                    return resolve()
                }

                const status = res.statusCode

                let log = displayStatusCode(status, link, option)

                resolve(log)
            },
        )
    })
}

const displayStatusCode = (code, link, option) => {
    if (code === 200) {
        if (option != 'b') {
            if (process.exitCode != 1 && process.exitCode != 2) {
                process.exitCode = 0
            }

            return chalk.green(`[200] GOOD ${link}`)
        }
    } else if (code === 400 || code === 404) {
        if (option != 'g') {
            if (process.exitCode != 2) process.exitCode = 1
            return chalk.red(`[${code}] BAD ${link}`)
        }
    } else {
        if (option != 'b' && option != 'g') {
            process.exitCode = 2
            return chalk.gray(`[${code}] UNKNOWN ${link}`)
        }
    }
}

module.exports = { isValid, displayStatusCode }
