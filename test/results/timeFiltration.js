import { expect } from 'chai';
import { getDateHoursAgo } from '../../src/methods/utils';
import { checkResultsByTime } from '../../src/expects/exResults';

describe('Results with time filtration', () => {
  // !!! тесты могут фейлиться из-за бага https://fbet-gitlab.ex2b.co/backend/tasks/issues/191
  it('C617603 - (+) 4 hours ago', async () => {
    const date = getDateHoursAgo(4);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 4,
      },
    });
    // console.log(data);

    checkResultsByTime(data, date);
  });

  it('C617604 - (+) 1 hour ago', async () => {
    const date = getDateHoursAgo(1);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 1,
      },
    });
    // console.log(data);

    checkResultsByTime(data, date);
  });

  it('C617605 - (+) 24 hours ago', async () => {
    const date = getDateHoursAgo(24);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 24,
      },
    });
    // console.log(data);

    checkResultsByTime(data, date);
  });

  it('C617606 - (+) 50 hours ago', async () => {
    const date = getDateHoursAgo(50);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 50,
      },
    });
    // console.log(data);

    checkResultsByTime(data, date);
  });

  it('C617607 - (-) future time', async () => {
    const date = getDateHoursAgo(-10);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: -10,
      },
    });
    // console.log(data);

    expect(JSON.stringify(data)).equal('{}');
  });

  it('C648112 - (-) invalid time', async () => {
    const date = getDateHoursAgo(-10);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 'aaaa',
      },
    });
    console.log(data);

    expect(JSON.stringify(data)).equal('{}');
  });
});
