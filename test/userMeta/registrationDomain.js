import { expect } from 'chai';
import { register } from '../../src/methods/register';
import { logOut } from '../../src/methods/user';
import { checkRegistrationDomain } from '../../src/expects/exDatabaseTests';

describe('Registration domain tests', () => {
  // Домен не выводится в socket.user_meta, надо проверять в бд

  beforeEach(async () => { await logOut(); });

  it('C28379 (+) one click reg without visit_domain', async () => {
    const { data } = await register.oneClickReg();
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).not.exist;
    checkRegistrationDomain(data.id, 'mobile_app');
  });

  it.skip('C28380 (+) one click reg with rub and visit_domain', async () => {
    const { data } = await register.oneClickWithVisitDomainRUB(defaultVisitDomain);
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).not.exist;
    checkRegistrationDomain(data.id, defaultVisitDomain);
  });

  it.skip('C28381 (+) one click reg with usd and visit_domain', async () => {
    const { data } = await register.oneClickWithVisitDomainUSD(defaultVisitDomain);
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).not.exist;
    checkRegistrationDomain(data.id, defaultVisitDomain);
  });

  it.skip('C28382 (+) one click reg with eur and visit_domain', async () => {
    const { data } = await register.oneClickWithVisitDomainEUR(defaultVisitDomain);
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).not.exist;
    checkRegistrationDomain(data.id, defaultVisitDomain);
  });

  it('C28383 (+) usual reg without visit_domain ', async () => {
    const { data } = await register.usualReg();
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).not.exist;
    checkRegistrationDomain(data.id, 'mobile_app');
  });

  it.skip('C28384 (+) usual reg with visit_domain', async () => {
    const { data } = await register.usualRegWithVisitDomain(defaultVisitDomain);
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).not.exist;
    checkRegistrationDomain(data.id, defaultVisitDomain);
  });
});
