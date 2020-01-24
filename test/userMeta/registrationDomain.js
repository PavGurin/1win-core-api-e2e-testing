import { register } from '../../src/methods/register';
import { checkRegistrationDomain } from '../../src/expects/exDatabaseTests';
import { sleep } from '../../src/methods/utils';

describe('Registration domain tests', () => {
  // Домен не выводится в socket.user_meta, надо проверять в бд
  beforeEach(async () => {
    sleep(5);
  });

  it('C28379 (+) one click registration without visit_domain', async () => {
    const { data } = await register.oneClickReg();
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).toBeUndefined();
    checkRegistrationDomain(data.id, 'mobile_app');
  });

  it.skip('C28380 (+) one click registration with RUB and visit_domain', async () => {
    const { data } = await register.oneClickWithVisitDomainRUB(defaultVisitDomain);
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).toBeUndefined();
    checkRegistrationDomain(data.id, defaultVisitDomain);
  });

  it.skip('C28381 (+) one click registration with USD and visit_domain', async () => {
    const { data } = await register.oneClickWithVisitDomainUSD(defaultVisitDomain);
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).toBeUndefined();
    checkRegistrationDomain(data.id, defaultVisitDomain);
  });

  it.skip('C28382 (+) one click registration with EUR and visit_domain', async () => {
    const { data } = await register.oneClickWithVisitDomainEUR(defaultVisitDomain);
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).toBeUndefined();
    checkRegistrationDomain(data.id, defaultVisitDomain);
  });

  it('C28383 (+) email registration without visit_domain ', async () => {
    const { data } = await register.usualReg();
    console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).toBeUndefined();
    checkRegistrationDomain(data.id, 'mobile_app');
  });

  it.skip('C28384 (+) email registration with visit_domain', async () => {
    const { data } = await register.usualRegWithVisitDomain(defaultVisitDomain);
    // console.log(data);
    const meta = await socket.userMeta;
    expect(meta.registration_domain).toBeUndefined();
    checkRegistrationDomain(data.id, defaultVisitDomain);
  });
});
