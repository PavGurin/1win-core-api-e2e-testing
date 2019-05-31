import {expect} from 'chai';

export function checkErrorMsg(data, expectedMessage) {
    expect(data.status).equal(400);
    expect(data.message).equal(expectedMessage);
}
