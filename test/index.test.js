/*eslint no-unused-vars: "error"*/
const { displayStatusCode } = require('../bin/index')

//need to be able to check options in the function

describe('logging bad request', () => {
    const log = jest.spyOn(global.console, 'log')
    displayStatusCode(404, 'testlink.com')
    it('should print to console', () => {
        expect(log).toHaveBeenCalledWith('[404] BAD testlink.com')
    })
})
