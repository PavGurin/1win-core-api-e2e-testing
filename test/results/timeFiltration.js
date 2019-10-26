import { getDateHoursAgo } from '../../src/methods/utils';
import { checkResultsByTime } from '../../src/expects/exResults';
import { checkErrMsg } from '../../src/responseChecker';

describe('Results with time filtration', () => {
  it('C617603 - (+) 4 hours ago', async () => {
    const date = getDateHoursAgo(4);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
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
        hoursToStart: 1,
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Bad request, timeFilter[hoursToStart] is invalid');
  });

  it('C617605 - (+) 24 hours ago', async () => {
    const date = getDateHoursAgo(24);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
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
        hoursToStart: 50,
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Bad request, timeFilter[hoursToStart] is invalid');
  });

  it('C617607 - (-) future time', async () => {
    const date = getDateHoursAgo(-10);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        hoursToStart: -10,
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Bad request, timeFilter[hoursToStart] is invalid');
  });

  it('C648112 - (-) invalid time', async () => {
    const date = getDateHoursAgo(-10);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        hoursToStart: 'aaaa',
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Bad request, timeFilter[hoursToStart] is invalid');
  });
});
