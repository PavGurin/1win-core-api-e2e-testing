describe('Sport-tournaments', () => {
  it('C21150 - Sport-tournaments prematch', async () => {
    const { data } = await socket.send('MATCH-STORAGE-2:sport-tournaments', {
      service: 'prematch',
      sportId: 'all',
      timeFilter: {
        date: false,
        hour: false,
      },
    });

    // console.log(data);
    expect(data.service).toEqual('prematch');
  });

  it('C21151 - Sport-tournaments live', async () => {
    const { data } = await socket.send('MATCH-STORAGE-2:sport-tournaments', {
      service: 'live',
      sportId: 'all',
      timeFilter: {
        date: false,
        hour: false,
      },
    });

    // console.log(data);
    expect(data.service).toEqual('live');
  });
});
