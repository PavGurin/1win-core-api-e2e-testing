import { getDateDaysAgo } from '../../src/methods/utils';
import { checkResultsByDate } from '../../src/expects/exResults';
import { checkErrMsg } from '../../src/responseChecker';

describe('Results with date filtration', () => {
  it('C22707 - (+) today', async () => {
    const date = getDateDaysAgo(0);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: date.formatted,
      },
    });
    // console.log(data);

    checkResultsByDate(data, date.timestamp);
  });

  it('C605604 - (+) yesterday', async () => {
    const date = getDateDaysAgo(1);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: date.formatted,
      },
    });
    // console.log(data);

    checkResultsByDate(data, date.timestamp);
  });

  it('C605606 - (+) 6 days ago', async () => {
    const date = getDateDaysAgo(6);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: date.formatted,
      },
    });
    // console.log(data);

    checkResultsByDate(data, date.timestamp);
  });


  it('C605607 - (+) 30 days ago', async () => {
    const date = getDateDaysAgo(30);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: date.formatted,
      },
    });
    // console.log(data);

    checkResultsByDate(data, date.timestamp);
  });

  it('C605605 - (+) tomorrow', async () => {
    const date = getDateDaysAgo(-1);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: date.formatted,
      },
    });
    // console.log(data);
    date.timestamp.setFullYear(date.timestamp.getFullYear() - 1);
    checkResultsByDate(data, date.timestamp);
  });

  it('C615229 - (-) invalid date', async () => {
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: 'aaaaa',
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Bad request, timeFilter[date] is invalid');
  });
});
