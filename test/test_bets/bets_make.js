import {expect} from 'chai';
import {userList} from '../../src/methods/userList';
import {register} from '../../src/methods/register';

describe('Bets check', () => {

    //TODO вынести методы в глобальные переменные по созданию ставки
    //TODO после обновить старые тесты с маркером dev

    it('Bets make ver1', async () => {
        const {data} = await socket.send('MATCH-STORAGE-2:sport-categories', {
            service: 'prematch',
            sportId: '1',
            timeFilter: {
                date: false,
                hour: false
            }
        });
        console.log(data);
        const {betData} = await socket.send('BETS:bets-make',
            {
                'currency': 'RUB',
                'betsMap': {
                    '': {
                        'amount': 13,
                        'couponList': [
                            {
                                'service': 'prematch',
                                'matchId': 16493397,
                                'typeId': 386,
                                'subTypeId': 0,
                                'outCome': 'Draw / No',
                                'specialValue': '*',
                                'coefficient': '7.98'
                            }
                        ]
                    }
                }
            }
        );
        console.log(betData);
    });

    it('Bets make ordinar without money', async () => {
        const {data: regReq} = await register.one_click_reg();
        await userList.login_with_params(regReq.email, regReq.password);
        const {betData} = await socket.send('BETS:bets-make',
            {
                'currency': 'RUB',
                'betsMap': {
                    'prematch_16493397_386_0_Draw / No_*': {
                        'amount': 1,
                        'couponList': [
                            {
                                'service': 'prematch',
                                'matchId': 16493397,
                                'typeId': 386,
                                'subTypeId': 0,
                                'outCome': 'Draw / No',
                                'specialValue': '*',
                                'coefficient': '7.98'
                            }
                        ]
                    }
                }
            }
        );
        //console.log(betData);

        expect(betData).to.deep.include({status: 403});
        expect(betData).to.deep.include({message: 'Недостаточно средств'});
    });

    it('Bets make ordinar with money', async () => {
        await userList.login_with_RUB();
        const {betData} = await socket.send('BETS:bets-make',
            {
                'currency': 'RUB',
                'betsMap': {
                    'prematch_16493397_386_0_Draw / No_*': {
                        'amount': 13,
                        'couponList': [
                            {
                                'service': 'prematch',
                                'matchId': 16493397,
                                'typeId': 386,
                                'subTypeId': 0,
                                'outCome': 'Draw / No',
                                'specialValue': '*',
                                'coefficient': '7.98'
                            }
                        ]
                    }
                }
            }
        );
        //console.log(betData);

        expect(betData).to.deep.include({status: 403});
        expect(betData).to.deep.include({message: 'Недостаточно средств'});
    });
});
