import { getDateDaysAgo, getDateHoursAgo } from '../../src/methods/utils';
import { checkResultsByDate } from '../../src/expects/exResults';
import { checkErrMsg } from '../../src/responseChecker';

describe('Results with date filtration', () => {
  it('C650507 - (-) no date and no time filtration', async () => {
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: false,
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Bad request, timeFilter[date] is invalid');
  });

  it('C650508 - (+) date and time filtration', async () => {
    const date = getDateDaysAgo(1);
    const hours = getDateHoursAgo(24 * 1 + 4);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: date.formatted,
        hoursToStart: 4,
      },
    });
    // console.log(data);

    checkResultsByDate(data, date.timestamp);
  });

  it('C1520548 - (-) invalid date  + valid hours', async () => {
    const date = getDateHoursAgo(50);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 50,
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Bad request, timeFilter[date] is invalid');
  });

  it('C1520549 - (-) invalid hours + valid date', async () => {
    const date = getDateDaysAgo(1);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: date.formatted,
        hoursToStart: false,
      },
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, timeFilter[hoursToStart] is invalid');
  });
});
