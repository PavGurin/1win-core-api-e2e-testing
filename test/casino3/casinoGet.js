describe('Casino get', () => {
  it('C1454840 - (+) valid request', async () => {
    const { data } = await socket.send('CASINO-3:games-get', {
      category: 1,
      onlyMobile: false,
    });
    // console.log(data);
    expect(data['0'].hasDemo).not.toBeNull();
  });
});
