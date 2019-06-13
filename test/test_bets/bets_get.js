import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Bets get', () => {

    it('(-) user without bet history', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BETS:bets-get', {
                id: 23,
                language: null
            }
        );
        // console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Ставка не найдена');
    });

    it('(-) without ID field', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BETS:bets-get', {
                language: null
            }
        );
        // console.log(data);
        expect(data.status).equal(400);
        expect(data.message).equal('Bad request, id is required');
    });

    it('(-) empty ID field', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BETS:bets-get', {
                id: '',
                language: null
            }
        );
        // console.log(data);
        expect(data.status).equal(400);
        expect(data.message).equal('Bad request, id should have a type of number, but found string');
    });

    it('(-) non authorized user get bet', async () => {
        const {data} = await socket.send('BETS:bets-get', {
                id: 23,
                language: null
            }
        );
        // console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Ставка не найдена');
    });

    it('(+) get ordinary bet by id', async () => {
        const test_bet_id = 23;

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-get', {
                id: test_bet_id,
                language: null
            }
        );
        // console.log(data);
        expect(data.id_user).equal(205);
        expect(data.betType).equal('ordinary');
        expect(data.currency).equal('RUB');
        expect(data.id).equal(test_bet_id);
        expect(data.selectionList['0'].bet_id).equal(test_bet_id);
    });

    it('(+) get express bet by id', async () => {
        const test_bet_id = 26;

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-get', {
                id: test_bet_id,
                language: null
            }
        );
        console.log(data);
        expect(data.id_user).equal(205);
        expect(data.betType).equal('express');
        expect(data.currency).equal('RUB');
        // проверяет 'id' ставки
        expect(data.id).equal(test_bet_id);
        expect(data.selectionList.length).equal(2);
        // проверяет 'bet_id' каждой ставки экспресса (должно совпадать
        for (let i = 0; i < data.selectionList.length; i++) {
            expect(data.selectionList[i].bet_id).equal(test_bet_id);
        }
    });
});
