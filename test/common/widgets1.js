describe('Widgets 1', () => {
  it('C1789506 - (+) valid request', async () => {
    const { data } = await socket.send('COMMON:widgets-1', {

      matchId: '-1',
    });

    // console.log(data);
    expect(data.status).toEqual(404);
    expect(data.message).toEqual('Widget with ID 1 not found');
  });

  it('C1789507 - (+) valid request', async () => {
    const { data } = await socket.send('COMMON:casino-widget', {

      games: ['spacewars_not_mobile_sw', 'bigbadwolf'],
      categories: [33, 41],
    });

    // console.log(data);
    expect(data['0'].hasDemo).not.toBeNull();
  });
});
