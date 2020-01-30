import { checkErrMsg, checkSuccess } from '../../src/responseChecker';
import { getPWA } from '../../src/methods/user';

describe('Downloading pwa by user for different devices', () => {
  it('C1743046 (+) pwa-android', async () => {
    const pwa = await getPWA('pwa-android');
    checkSuccess(pwa);
  });
  it('C1743049 (+) android', async () => {
    const pwa = await getPWA('android');
    checkSuccess(pwa);
  });
  it('C1743047 (+) pwa-ios', async () => {
    const pwa = await getPWA('pwa-ios');
    checkSuccess(pwa);
  });
  it('C1743048 (+) ios', async () => {
    const pwa = await getPWA('ios');
    checkSuccess(pwa);
  });
  it('C1743050 (+) pwa-desktop', async () => {
    const pwa = await getPWA('pwa-desktop');
    checkSuccess(pwa);
  });
  it('C1745257 (-) sending integer into platform name', async () => {
    const pwa = await getPWA(11);
    checkErrMsg(pwa.data, 400, 'Bad request, platform should have a type of string, but found number');
  });
});
