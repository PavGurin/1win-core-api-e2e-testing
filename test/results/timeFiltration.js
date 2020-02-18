import { getDateHoursAgo } from '../../src/methods/utils';
import { checkResultsByTime } from '../../src/expects/exResults';
import { checkErrMsg } from '../../src/responseChecker';

describe('Results with time filtration', () => {
  it('C1789524 - (+) 4 hours ago', async () => {
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

  it('C1953987 - (+) 8 hours ago', async () => {
    const date = getDateHoursAgo(8);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 8,
      },
    });
    // console.log(data);

    checkResultsByTime(data, date);
  });

  it('C1953988 - (+) 12 hours ago', async () => {
    const date = getDateHoursAgo(12);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 12,
      },
    });
    // console.log(data);

    checkResultsByTime(data, date);
  });

  it('C1789526 - (+) 24 hours ago', async () => {
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

  it('C1789525 - (-) <4 hours ago', async () => {
    const date = getDateHoursAgo(1);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 1,
      },
    });
    // console.log(JSON.stringify(data));

    checkErrMsg(data, 400, 'Bad request, timeFilter[hoursToStart] is invalid');
  });

  it('C1789527 - (-) >24 hours ago', async () => {
    const date = getDateHoursAgo(50);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 50,
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Bad request, timeFilter[hoursToStart] is invalid');
  });

  it('C1789528 - (-) future time', async () => {
    getDateHoursAgo(-10);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: -10,
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Bad request, timeFilter[hoursToStart] is invalid');
  });

  it('C1789529 - (-) invalid time', async () => {
    getDateHoursAgo(-10);
    // console.log(date);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: 'aaaa',
      },
    });
    // console.log(data);

    checkErrMsg(data, 400, 'Bad request, timeFilter[hoursToStart] is invalid');
  });
});
