import {expect} from 'chai';
import {userList} from '../../src/methods/userList';

describe('Bets history', () => {

    it('(+) user w/o bet history default filter', async () => {

        await userList.login_without_money();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],

            where: {
                betType: ['ordinary', 'express']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    it('(-) no order value', async () => {

        await userList.login_without_money();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],

            where: {
                betType: ['ordinary', 'express']
            }
        });
        //console.log(data);
        expect(data.status).equal(400);
        expect(data.message).equal('Bad request, order is required, no default value provided');
    });

    it('(-) no limit value', async () => {

        await userList.login_without_money();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            order: ['id', 'DESC'],
            where: {
                betType: ['ordinary', 'express']
            }
        });
        // console.log(data);
        expect(data.status).equal(400);
        expect(data.message).equal('Bad request, limit is required, no default value provided');
    });

    it('(+) user w/o bet history asc order', async () => {

        await userList.login_without_money();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'ASC'],
            where: {
                betType: ['ordinary', 'express']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    it('(+) user w/o bet history, bet type \'express\'', async () => {

        await userList.login_without_money();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'ASC'],
            where: {
                betType: ['express']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    it('(+) user w/o bet history, bet type \'ordinary\'', async () => {

        await userList.login_without_money();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'ASC'],
            where: {
                betType: ['ordinary']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    // it('(+) user with bet history, bet type \'ordinary\'', async () => {
    //
    //     await userList.login_with_RUB();
    //     const {data:{betsMap}} = await socket.send('BETS:bets-history', {
    //         language: null,
    //         limit: [0, 20],
    //         order: ['id', 'ASC'],
    //         where: {
    //             betType: ['ordinary']
    //         }
    //     });
    //
    //     console.log(betsMap);
    //     expect(Object.entries(betsMap).length).equal(10);
    //     // expect(Object.values(betsMap).every((
    //     //     // {id_user}) => id_user === 205)).equal(true);
    //     //     {betType}) => betType === 'ordinary')).equal(true);
    //     // expect(Object.values(betsMap).every((
    //     //     {id_user}) => id_user === 205)).equal(true);
    // });

    // PROD version
    it('(+) user with bet history, bet type \'ordinary\'', async () => {

        await userList.login_prod_bet_history();
        const {data: {betsMap}} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 15],
            order: ['id', 'ASC'],
            where: {
                betType: ['ordinary']
            }
        });

        //console.log(betsMap);
        expect(Object.entries(betsMap).length).equal(15);
        expect(Object.values(betsMap).every(({betType}) => betType === 'ordinary')).equal(true);
        // expect(Object.values(betsMap).every((
        //     // {id_user}) => id_user === 205)).equal(true);
        //     {betType}) => betType === 'ordinary')).equal(true);
        // expect(Object.values(betsMap).every((
        //     {id_user}) => id_user === 205)).equal(true);
    });

    /** Bets statuses:
     status 0 - opened, 1 - lost, 2 - returned, 3 - won
     **/

    // TODO 'service' should be fixed to run ALL filters
    it('(+) all filters with all available values', async () => {

        await userList.login_with_RUB();
        const {data: {betsMap}} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],
            // полные настройки фильтра в блоке 'where'
            where: {
                status: [0, 1, 2, 3],
                // service: ['live', 'prematch'],
                betType: ['ordinary', 'express']
            }
        });
        // console.log(betsMap);
        expect(Object.entries(betsMap).length).equal(12);
    });

    // TODO поменять в тестовой БД статус некоторых ставок вместо '0' чтобы проверить фильтр по статусу
    // check that amount of all statuses bets > one status bets amount
    // it('(+) only \'lost\' bets status (status = 1)', async () => {
    //
    //     await userList.login_prod_bet_history();
    //     const {data: {betsMap}} = await socket.send('BETS:bets-history', {
    //         language: null,
    //         limit: [0, 20],
    //         order: ['id', 'DESC'],
    //
    //         where: {
    //             status: [1],
    //             // service: ['live', 'prematch'],
    //             betType: ['ordinary', 'express']
    //         }
    //     });
    //     console.log(betsMap);
    //     expect(Object.entries(betsMap).length).equal(1);
    //     expect(betsMap['23'].status).equal(1);
    // });

    it('(+) only \'lost\' bets status (status = 1)', async () => {

        await userList.login_prod_bet_history();
        const {data: {betsMap}} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 15],
            order: ['id', 'DESC'],

            where: {
                status: [1],
                // service: ['live', 'prematch'],
                betType: ['ordinary', 'express']
            }
        });
        // console.log(betsMap);
        expect(Object.entries(betsMap).length).equal(15);
        expect(Object.values(betsMap).every(({status}) => status === 1)).equal(true);
    });

    // it('(+) only \'returned\' bets status (status = 2)', async () => {
    //
    //     await userList.login_with_RUB();
    //     const {data: {betsMap}} = await socket.send('BETS:bets-history', {
    //         language: null,
    //         limit: [0, 20],
    //         order: ['id', 'DESC'],
    //
    //         where: {
    //             status: [2],
    //             // service: ['live', 'prematch'],
    //             betType: ['ordinary', 'express']
    //         }
    //     });
    //     // console.log(data);
    //     expect(Object.entries(betsMap).length).equal(2);
    //     expect(Object.values(betsMap).every(({status}) => status === 2)).equal(true);
    // });


    it('(+) only \'returned\' bets status (status = 2)', async () => {

        await userList.login_prod_bet_history();
        const {data: {betsMap}} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 15],
            order: ['id', 'DESC'],

            where: {
                status: [2],
                // service: ['live', 'prematch'],
                betType: ['ordinary', 'express']
            }
        });
        //console.log(betsMap);
        expect(Object.entries(betsMap).length).equal(15);
        expect(Object.values(betsMap).every(({status}) => status === 2)).equal(true);
    });

    // it('(+) only \'won\' bets status (status = 3)', async () => {
    //
    //     await userList.login_with_RUB();
    //     const {data: {betsMap}} = await socket.send('BETS:bets-history', {
    //         language: null,
    //         limit: [0, 20],
    //         order: ['id', 'DESC'],
    //
    //         where: {
    //             status: [3],
    //             // service: ['live', 'prematch'],
    //             betType: ['ordinary', 'express']
    //         }
    //     });
    //     // console.log(data);
    //     expect(Object.entries(betsMap).length).equal(3);
    //     expect(Object.values(betsMap).every(({status}) => status === 3)).equal(true);
    // });

    it('(+) only \'won\' bets status (status = 3)', async () => {

        await userList.login_prod_bet_history();
        const {data: {betsMap}} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 15],
            order: ['id', 'DESC'],

            where: {
                status: [3],
                // service: ['live', 'prematch'],
                betType: ['ordinary', 'express']
            }
        });
        // console.log(betsMap);
        expect(Object.entries(betsMap).length).equal(15);
        expect(Object.values(betsMap).every(({status}) => status === 3)).equal(true);
    });

    // TODO wait for limit assignment
    it('(-) limits \'from\' equal \'to\' value', async () => {

        await userList.login_with_RUB();
        const {data: {betsMap}} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 0],
            order: ['id', 'DESC'],

            where: {
                status: [0, 1, 2, 3],
                service: null,
                betType: ['ordinary', 'express']
            }
        });
        // console.log(betsMap);
        expect(data.betsMap).to.be.empty;
    });

    it('(-) limits \'from\' value > than \'to\' value', async () => {

        await userList.login_with_RUB();
        const {data: {betsMap}} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [10, 0],
            order: ['id', 'DESC'],

            where: {
                status: [0, 1, 2, 3],
                service: null,
                betType: ['ordinary', 'express']
            }
        });
        // console.log(betsMap);
        expect(data.betsMap).to.be.empty;
    });

    //TODO fix expect
    it('(-) 5 limits + 5 offset, where all filters, where service = null', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [5, 5],
            order: ['id', 'DESC'],

            where: {
                status: [0, 1, 2, 3],
                service: null,
                betType: ['ordinary', 'express']
            }
        });
        //console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    //TODO fix expect
    it('(+) 5 limits + 2 offset, where all filters, where service = null', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [2, 5],
            order: ['id', 'DESC'],

            where: {
                status: [0, 1, 2, 3],
                service: null,
                betType: ['ordinary', 'express']
            }
        });
        //console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });
});
