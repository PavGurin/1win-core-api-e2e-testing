import { expect } from 'chai';

import { userList } from '../../src/methods/userList';
import {
  generateExpressCoupon,
  generateOrdinaryCoupon,
  makeExpressBet,
  makeOrdinaryBet,
} from '../../src/methods/better';

import {
  getMatchHistory, getSingleMatch, sportTournaments, tournamentMatches,
} from '../../src/methods/matchStorage';

const PREMATCH = 'prematch';
const LIVE = 'live';
const ORDINARY = 'ordinary';

beforeEach(async () => {
  await userList.loginWithRealMoney();
});

describe('Series', () => {


});
