import { getDateDaysAgo } from '../../src/methods/utils';
import { checkResultsByDate } from '../../src/expects/exResults';
import { checkErrMsg } from '../../src/responseChecker';

// TODO пока нет результатов на стейдже
describe.skip('Results with date filtration', () => {
  it('C22707 - (+) today', async () => {
    const date = getDateDaysAgo(0);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: date.formatted,
        hoursToStart: false,
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
        hoursToStart: false,
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
        hoursToStart: false,
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
        hoursToStart: false,
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
        hoursToStart: false,
      },
    });
    // console.log(data);
    date.timestamp.setFullYear(date.timestamp.getFullYear() - 1);
    checkResultsByDate(data, date.timestamp);
  });

  it('C615229 - (-) invalid date', async () => {
    // будет фейлиться, см. https://fbet-gitlab.ex2b.co/backend/tasks/issues/188
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: 'aaaaa',
        hoursToStart: false,
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Invalid date');
  });
});
