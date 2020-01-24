import { cases } from '../../src/methods/cases';
import { checkErrMsg } from '../../src/responseChecker';

describe('Unauthorized requests to money-cases service', () => {
  it('C484977 - play  cases 8', async () => {
    const { data } = await cases.playCaseWithoutChance(8);

    checkErrMsg(data, 401, 'Unauthorized');
  });
});
