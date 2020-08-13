import { getTitles } from '../../src/methods/common';
import { checkEmptyTitle, checkTitle } from '../../src/expects/exCommon';


describe('Titles route tests', () => {
  it('C2190635 (-) no params', async () => {
    const data = await getTitles();
    // console.log(data);
    expect(data.data).toEqual('Bad Request');
    expect(data.status).toEqual(400);
    expect(data.statusText).toEqual('Bad Request');
  });
  it('C2190636 (+) path only, russian lang by default', async () => {
    const data = await getTitles({ path: 'cases' });
    // console.log(data);
    checkTitle(data, 'ru', 'cases');
  });
  it('C2190637 (+) path + lang', async () => {
    const data = await getTitles({ lang: 'en', path: 'cases' });
    // console.log(data);
    checkTitle(data, 'en', 'cases');
  });
  it('C2190638 (-) lang only', async () => {
    const data = await getTitles({ lang: 'en' });
    // console.log(data);
    expect(data.data).toEqual('Bad Request');
    expect(data.status).toEqual(400);
    expect(data.statusText).toEqual('Bad Request');
  });
  it('C2190639 (-) path + unexistent lang', async () => {
    const data = await getTitles({ lang: 'test', path: 'cases' });
    // console.log(data);
    checkEmptyTitle(data);
  });
  it('C2190640 (-) unexistent path + lang', async () => {
    const data = await getTitles({ lang: 'ru', path: 'unexistent' });
    // console.log(data);
    checkEmptyTitle(data);
  });
  it('C2202828 (+) path with space', async () => {
    const data = await getTitles({ lang: 'ru', path: 'path with space' });
    // console.log(data);
    checkTitle(data, 'ru', 'path with space');
  });
  it('C2202829 (+) path with underscore', async () => {
    const data = await getTitles({ lang: 'ru', path: 'path_with_underscore' });
    // console.log(data);
    checkTitle(data, 'ru', 'path_with_underscore');
  });
  it('C2202830 (+) path with dot', async () => {
    const data = await getTitles({ lang: 'ru', path: 'path.with.dot' });
    // console.log(data);
    checkTitle(data, 'ru', 'path.with.dot');
  });
  it('C2202831 (+) path with symbols', async () => {
    const data = await getTitles({ lang: 'ru', path: 'p-=%@!()' });
    // console.log(data);
    checkTitle(data, 'ru', 'p-=%@!()');
  });
  it('C2202832 (+) path = one letter', async () => {
    const data = await getTitles({ lang: 'en', path: 'x' });
    // console.log(data);
    checkTitle(data, 'en', 'x');
  });
  it('C2202833 (+) path with "', async () => {
    const data = await getTitles({ lang: 'ru', path: '"casino"' });
    // console.log(data);
    // eslint-disable-next-line no-useless-escape
    checkTitle(data, 'ru', '\"casino\"');
  });
});
