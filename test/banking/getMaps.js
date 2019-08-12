import { expect } from 'chai';

describe('Get methods map', () => {
  it('C19356 Withdrawal methods map without login', async () => {
    const { data } = await socket.send('BANKING:methods-withdrawal');
    // console.log(data);
    expect(data).to.be.an('object');
    expect(data.advcash_rub.name).equal('advcash_rub');
    expect(data.beeline_rub.name).equal('beeline_rub');
    expect(data.card_rub.name).equal('card_rub');
    expect(data.megafon_rub.name).equal('megafon_rub');
    expect(data.mts_rub.name).equal('mts_rub');
    expect(data.payeer_rub.name).equal('payeer_rub');
    expect(data.qiwi_rub.name).equal('qiwi_rub');
    expect(data.tele2_rub.name).equal('tele2_rub');
    expect(data.webmoney_rub.name).equal('webmoney_rub');
    expect(data.yamoney_rub.name).equal('yamoney_rub');
  });

  it('C19358 Payment methods map without login', async () => {
    const { data } = await socket.send('BANKING:methods-payment');
    // console.log(data);
    expect(data).to.be.an('object');
    expect(data.beeline_rub.name).equal('beeline_rub');
    expect(data.btc_usd.name).equal('btc_usd');
    expect(data.card_rub.name).equal('card_rub');
    expect(data.eth_usd.name).equal('eth_usd');
    expect(data.megafon_rub.name).equal('megafon_rub');
    expect(data.mts_rub.name).equal('mts_rub');
    expect(data.piastrix_rub.name).equal('piastrix_rub');
    expect(data.qiwi_rub.name).equal('qiwi_rub');
    expect(data.tele2_rub.name).equal('tele2_rub');
    expect(data.yamoney_rub.name).equal('yamoney_rub');
  });
});
