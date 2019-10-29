describe('Get methods map', () => {
  it('C19356 Withdrawal methods map without login', async () => {
    const { data } = await socket.send('BANKING:methods-withdrawal');
    expect(data).toMatchSnapshot();
  });

  it('C19358 Payment methods map without login', async () => {
    const { data } = await socket.send('BANKING:methods-payment');
    // console.log(data);
    expect(data).toMatchSnapshot();
  });
});
