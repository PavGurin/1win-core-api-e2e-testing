import { expect } from 'chai';

export function checkMailRequisites(mail, expectedSubject, expectedName, expectedAddress) {
  expect(mail.subject).to.equal(expectedSubject);
  expect(mail.from_name).to.equal(expectedName);
  expect(mail.from_address).to.equal(expectedAddress);
}
