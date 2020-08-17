
export function checkErrMsg(data, expStatus, expMessage) {
  expect(data.status).toEqual(expStatus);
  expect(data.message).toEqual(expMessage);
}

export function checkSuccess(socketResponse) {
  expect(socketResponse.status).toEqual(200);
  expect(socketResponse.data.error).toBeOneOf([false, undefined]);
}
