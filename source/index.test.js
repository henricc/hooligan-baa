const { hasUncaughtExceptionCaptureCallback } = require('process');
var rewire = require('rewire'); // https://github.com/jhnns/rewire - Allows tests without exporting function
const index = rewire('./index.js');

const containsUserId = index.__get__('containsUserId');



describe("Tests for userId input.", () => {

    test("Non-empty userId should return true", () => {
        expect(containsUserId("testUserId")).toBe(true);
    });

    test('Undefined userId should return false', () => {
        expect(containsUserId(undefined)).toBe(false);
    });

    test("empty userId should return false", () => {
        expect(containsUserId("")).toBe(false);
    });
});

