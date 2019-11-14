export function checkMailRequisites(mail, expectedSubject, expectedName, expectedAddress) {
  expect(mail.subject).toEqual(expectedSubject);
  expect(mail.from_name).toEqual(expectedName);
  expect(mail.from_address).toEqual(expectedAddress);
}

export function checkMailTextLoginPass(mailText, expectedLogin, expectedPassword) {
  expect(mailText).toEqual(`Login: ${expectedLogin}<br>Password: ${expectedPassword}\n`);
}
