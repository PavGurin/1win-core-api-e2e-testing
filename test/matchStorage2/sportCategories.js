describe('Sport categories', () => {
  it('C21148 - (+) valid request prematch', async () => {
    const { data } = await socket.send('MATCH-STORAGE-2:sport-categories', {
      service: 'prematch',
      sportId: 'all',
      timeFilter: {
        date: false,
        hour: false,
      },
    });
    // console.log(data);
    expect(data.service).toEqual('prematch');
    // expect(data.sportCategoriesMap["0"].categoryIconFileId).not.equal(null);
    expect(data.sportCategoriesMap['0'].categoryId).not.toBeNull();
    expect(data.sportCategoriesMap['0'].categoryName.en).not.toBeNull();
    expect(data.sportCategoriesMap['0'].categoryName.ru).not.toBeNull();
    expect(data.sportCategoriesMap['0'].sportId).not.toBeNull();
    expect(data.sportCategoriesMap['0'].sportName.en).not.toBeNull();
    expect(data.sportCategoriesMap['0'].sportName.ru).not.toBeNull();
  });

  it.skip('C21149 - (+) valid request live @master', async () => {
    const { data } = await socket.send('MATCH-STORAGE-2:sport-categories', {
      service: 'live',
      sportId: 'all',
      timeFilter: {
        date: false,
        hour: false,
      },
    });
    // console.log(data);
    expect(data.service).toEqual('live');
    expect(data.sportCategoriesMap['0'].categoryIconFileId).not.toBeNull();
    expect(data.sportCategoriesMap['0'].categoryId).not.toBeNull();
    expect(data.sportCategoriesMap['0'].categoryName.en).not.toBeNull();
    expect(data.sportCategoriesMap['0'].categoryName.ru).not.toBeNull();
    expect(data.sportCategoriesMap['0'].sportId).not.toBeNull();
    expect(data.sportCategoriesMap['0'].sportName.en).not.toBeNull();
    expect(data.sportCategoriesMap['0'].sportName.ru).not.toBeNull();
  });
});
