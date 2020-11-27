const manageLinkList = require('../bin/manageLinkList')
/*
NEEDED: test validateLinks function in manageLinkList.js
*/
describe('test generateLinkList function', () => {
    test('should return with only youtube.com', () => {
        let expected = ['http://www.youtube.com']
        let list = ['http://www.youtube.com', 'http://www.paypal.com']
        let ignore = ['http://www.paypal.com']
        let result = Array.from(
            manageLinkList.generateLinkList(list, ignore, true),
        )

        expect(result).toEqual(expected)
    })

    test('should return with youtube.com and paypal.com', () => {
        let expected = ['http://www.youtube.com', 'http://www.paypal.com']
        let ignore = ['http://www.youtube.com', 'http://www.paypal.com']
        let result = Array.from(
            manageLinkList.generateLinkList(expected, ignore),
        )

        expect(result).toEqual(expected)
    })
})
