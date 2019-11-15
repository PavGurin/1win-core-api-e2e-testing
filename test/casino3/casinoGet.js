describe('Casino get', () => {
  it('C1454840 - Casino get by categories', async () => {
    const { data } = await socket.send('CASINO-3:games-get', {
      category: 1,
      onlyMobile: false,
    });
    // console.log(data);
    expect(data['0'].hasDemo).not.toBeNull();
  });

  it('C1601219 - Casino get by category and owner name', async () => {
    const { data } = await socket.send('CASINO-3:games-get', {
      category: 1,
      ownerName: 'Elk',
      onlyMobile: false,
    });
    // console.log(data);
    expect(data['0'].hasDemo).not.toEqual(null);
  });
});
