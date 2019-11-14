describe('Health checker ms-banking light', () => {
  it('light', async () => {
    const data = await socket.send('BANKING:-health');
    // console.log(data);
    expect(data.status).toEqual(200);
    expect(data.data).toEqual('OK');
  });
});
