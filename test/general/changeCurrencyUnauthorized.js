import { changeCurrency } from '../../src/methods/user';
import { checkErrMsg } from '../../src/responseChecker';

describe('Unauthorized requests to changeCurrency', () => {
  it('C27440 - should be bad request without registration ', async () => {
    const { data } = await changeCurrency('RUB');

    checkErrMsg(data, 400, 'Bad Request.');
  });
});
