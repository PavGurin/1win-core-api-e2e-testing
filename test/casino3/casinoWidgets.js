describe('Casino Hot Widgets', () => {
  it('Games-widgets', async () => {
    const { data } = await socket.send('CASINO-3:categories-widgets', {});

    // console.log(data);
  });
});
