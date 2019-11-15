describe('Casino games owners name', () => {
  it('get games owners list', async () => {
    const { data } = await socket.send('CASINO-3:games-owners', {});
    // console.log(data);
    for (let i = 0; i < Object.values(data).length; i++) {
      expect(data[i].name).not.toEqual(null);
      expect(data[i].amount).toBeGreaterThanOrEqual(0);
    }
  });
});
