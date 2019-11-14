describe('Sport all', () => {
  it('C21146 - (+) valid request prematch', async () => {
    const { data } = await socket.send('MATCH-STORAGE-2:sport-all', {
      service: 'prematch',
      timeFilter: {
        date: false,
        hour: false,
      },
    });
    // console.log(data);
    expect(data.service).toEqual('prematch');
    expect(data.sportMap['1'].matchCount).not.toBeNull();
    expect(data.sportMap['1'].sportId).not.toBeNull();
    expect(data.sportMap['1'].sportName.en).not.toBeNull();
    expect(data.sportMap['1'].sportName.ru).not.toBeNull();
  });

  it.skip('C21147 - (+) valid request live @master', async () => {
    const { data } = await socket.send('MATCH-STORAGE-2:sport-all', {
      service: 'live',
      timeFilter: {
        date: false,
        hour: false,
      },
    });
    // console.log(data);
    expect(data.service).equal('live');
    expect(data.sportMap['1'].matchCount).not.toBeNull();
    expect(data.sportMap['1'].sportId).not.toBeNull();
    expect(data.sportMap['1'].sportName.en).not.toBeNull();
    expect(data.sportMap['1'].sportName.ru).not.toBeNull();
  });
});
