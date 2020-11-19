/*eslint no-unused-vars: "error"*/
const isValid = require('../bin/isValid')
const chalk = require('chalk')
const nock = require('nock')

const host = 'https://www.youtube.com'
const path = '/'

describe('test logging for good, bad, and unknown requests', () => {
    test('print good url', async () => {
        const expected = chalk.green('[200] GOOD http://www.google.ca')
        const result = isValid.displayStatusCode(200, 'http://www.google.ca')

        expect(result).toEqual(expected)
    })
    test('print bad url', async () => {
        const expected = chalk.red('[400] BAD http://www.google.ca')
        const result = isValid.displayStatusCode(400, 'http://www.google.ca')

        expect(result).toEqual(expected)
    })

    test('print unknown url', async () => {
        const expected = chalk.gray('[405] UNKNOWN http://www.google.ca')
        const result = isValid.displayStatusCode(405, 'http://www.google.ca')

        expect(result).toEqual(expected)
    })

    test('print nothing when option is b and sent a good link', async () => {
        const result = isValid.displayStatusCode(
            200,
            'http://www.google.ca',
            'b',
        )

        expect(result).toEqual(undefined)
    })

    test('print nothing when option is g and sent a bad link', async () => {
        const result = isValid.displayStatusCode(
            404,
            'http://www.google.ca',
            'g',
        )

        expect(result).toEqual(undefined)
    })

    test('print nothing when option is g and sent an unknown link', async () => {
        const result = isValid.displayStatusCode(
            405,
            'http://www.google.ca',
            'g',
        )

        expect(result).toEqual(undefined)
    })
})

describe('test http responses for good, bad, and non-working links', () => {
    test('get 200 response for good url', async () => {
        nock(host).head(path).reply(200)
        const url = `${host}${path}`
        const expected = chalk.green(`[200] GOOD ${url}`)
        const result = await isValid.isValid(url)

        expect(result).toEqual(expected)
    })

    test('get 404 response for bad url', async () => {
        nock(host).head(path).reply(404)
        const url = `${host}${path}`
        const expected = chalk.red(`[404] BAD ${url}`)
        const result = await isValid.isValid(url)

        expect(result).toEqual(expected)
    })

    test('get 405 response for unknown url', async () => {
        nock(host).head(path).reply(405)
        const url = `${host}${path}`
        const expected = chalk.gray(`[405] UNKNOWN ${url}`)
        const result = await isValid.isValid(url)

        expect(result).toEqual(expected)
    })

    test('get TIMEOUT response for timed out url', async () => {
        nock(host).head(path).delay(1600).reply(404)
        const url = `${host}${path}`
        const expected = chalk.gray(`[TIMEOUT] ${url}`)
        const result = await isValid.isValid(url)

        expect(result).toEqual(expected)
    })

    test('get nothing when TIMEOUT and option is g', async () => {
        nock(host).head(path).delay(1600).reply(404)
        const url = `${host}${path}`
        const result = await isValid.isValid(url, 'g')

        expect(result).toEqual(undefined)
    })
})
