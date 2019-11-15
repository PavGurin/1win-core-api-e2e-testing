import { cases } from '../../src/methods/cases';

describe('Health checker', () => {
  it('light', async () => {
    const data = await cases.getCaseInfo('all');

    // console.log(data);
    expect(data.status).toEqual(200);
  });
});
