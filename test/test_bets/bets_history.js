import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('bets-history', () => {

    it('login', async () => {

        await userList.login_without_money();


        const {data} = await socket.send('bets-history:get');
        console.log(data);
        expect(data.message).equal(undefined);
    });





});
