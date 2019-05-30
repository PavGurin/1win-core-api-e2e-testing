import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Bets get', () => {

    it('(-) Without bets', async () => {
        await userList.login_without_money();
        const {data} = await socket.send('BETS:bets-get', {
                id: 23,
                language: null
            }
        );
        console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Ставка не найдена');
    });

    //TODO должно быть сообщение о том что пользователь не авторизован
    it('(-) unauth', async () => {
        const {data} = await socket.send('BETS:bets-get', {
                id: 23,
                language: null
            }
        );
        console.log(data);
        expect(data.status).equal(404);
        expect(data.message).equal('Ставка не найдена');
    });

    it('(+) With bets', async () => {
        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-get', {
                id: 23,
                language: null
            }
        );
        console.log(data);
        expect(data.selectionList["0"].bet_id).equal(23);

    });


});
