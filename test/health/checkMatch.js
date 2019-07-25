import { expect } from 'chai';

describe('Tournament hot filter: prematch', () => {
  it(' - tournament-matches prematch 1 hour', async () => {
    const { data } = await socket.send('MATCH-STORAGE-2:tournament-matches', {
      service: 'prematch',
      timeFilter: {
        date: false,
        hoursToStart: 1,
      },
      tournamentId: 'all',
    });
    // console.log(data);
    expect(data.service).equal('prematch');
  });
});
