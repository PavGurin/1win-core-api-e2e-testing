describe('Health checker ms-bets light', () => {
  it('light', async () => {
    const data = await socket.send('BETS:-health');
    // console.log(data);
    expect(data.status).toEqual(200);
    expect(data.data).toEqual('OK');
  });
});
