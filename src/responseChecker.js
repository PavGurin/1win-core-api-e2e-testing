import { expect } from 'chai';

export function checkErrorMsg(data, expectedMessage) {
  expect(data.status).equal(400);
  expect(data.message).equal(expectedMessage);
}

export function checkErrMsg(data, expStatus, expMessage) {
  expect(data.status).equal(expStatus);
  expect(data.message).equal(expMessage);
}

export function checkError404(data, expectedMessage) {
  expect(data.status).equal(404);
  expect(data.message).equal(expectedMessage);
}

export function checkSuccess(socketResponse) {
  expect(socketResponse.status).equal(200);
  expect(socketResponse.data.error).to.be.oneOf([false, undefined]);
}
