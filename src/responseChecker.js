import {expect} from 'chai';

export function checkErrorMsg(data, expectedMessage) {
    expect(data.status).equal(400);
    expect(data.message).equal(expectedMessage);
}

export function checkErrMsg(data, expStatus, expMessage) {
    expect(data.status).equal(expStatus);
    expect(data.message).equal(expMessage);
}
