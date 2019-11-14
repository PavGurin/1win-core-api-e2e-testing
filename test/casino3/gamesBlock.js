describe('Games-block', () => {
  it('C21139 - (+) valid request', async () => {
    const { data } = await socket.send('CASINO-3:games-block', {});

    // console.log(data);
    expect(data['0'].hasDemo).not.toBeNull();
  });
});
