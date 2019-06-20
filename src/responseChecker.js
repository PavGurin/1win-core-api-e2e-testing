import {expect} from 'chai';

export function checkErrorMsg(data, expectedMessage) {
    expect(data.status).equal(400);
    expect(data.message).equal(expectedMessage);
}

export function checkError404(data, expectedMessage) {
    expect(data.status).equal(404);
    expect(data.message).equal(expectedMessage);
}
