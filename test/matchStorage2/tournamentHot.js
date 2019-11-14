describe('Tournament hot', () => {
  it('C21152 - Tournament hot without parameters ', async () => {
    const { data } = await socket.send('MATCH-STORAGE-2:tournament-hot', {});

    // console.log(data);
    expect(data).not.toBeNull();
  });
});
