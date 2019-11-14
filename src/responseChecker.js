
export function checkErrorMsg(data, expectedMessage) {
  expect(data.status).toEqual(400);
  expect(data.message).toEqual(expectedMessage);
}

export function checkErrMsg(data, expStatus, expMessage) {
  expect(data.status).toEqual(expStatus);
  expect(data.message).toEqual(expMessage);
}

export function checkError404(data, expectedMessage) {
  expect(data.status).toEqual(404);
  expect(data.message).toEqual(expectedMessage);
}

export function checkSuccess(socketResponse) {
  expect(socketResponse.status).toEqual(200);
  expect(socketResponse.data.error).toBeOneOf([false, undefined]);
}
