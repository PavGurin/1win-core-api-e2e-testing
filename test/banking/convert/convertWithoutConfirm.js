import { expect } from 'chai';
import { userForAutoConfirm } from '../../../src/methods/userForAutoConfirm';

// TODO дописать тесты когда запустят конвертацию
describe('Convert with money - RUB', () => {
  it(' (+) With money', async () => {
    await userForAutoConfirm.EmailMail();

    // console.log(data);
    // expect(data.confirmationRequested).equal(false);
    // expect(data.email).not.equal(null);
  });
});