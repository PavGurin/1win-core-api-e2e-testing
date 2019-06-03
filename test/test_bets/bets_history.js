import {expect} from 'chai';
import {userList} from '../../src/userList';

describe('Bets history', () => {

    it('(+) without bets default filter', async () => {

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

    it('(+) without bets asc order', async () => {

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

    it('(+) without bets betType filter', async () => {

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

    it('(+) without bets with all filters', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],

            where: {
                status: [0, 1, 2, 3],
                service: ['live', 'prematch'],
                betType: ['ordinary', 'express']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    it('(+) with bets, where all filters, where service = null', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],

            where: {
                status: [0, 1, 2, 3],
                service: null,
                betType: ['ordinary', 'express']
            }
        });
        // console.log(data);
        expect(data.totalCount).to.equal(12);
    });

    it('(+) only ordinary bets, where all filters, where service = null', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],

            where: {
                status: [0, 1, 2, 3],
                service: null,
                betType: ['ordinary']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(10);
    });

    it('(+) only express bets, where all filters, where service = null', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],

            where: {
                status: [0, 1, 2, 3],
                service: null,
                betType: ['express']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(2);
        expect(data.betsMap).to.not.be.empty;
    });

    it('(+) only opened bets(status = 0), where all filters, where service = null', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],

            where: {
                status: [0],
                service: null,
                betType: ['ordinary', 'express']
            }
        });
        // console.log(data);
        expect(data.totalCount).not.equal(0);
        expect(data.betsMap).to.not.be.empty;
    });

    it('(+) only lost bets(status = 1), where all filters, where service = null', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],

            where: {
                status: [1],
                service: null,
                betType: ['ordinary', 'express']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    it('(+) only returned bets(status = 2), where all filters, where service = null', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],

            where: {
                status: [2],
                service: null,
                betType: ['ordinary', 'express']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    it('(+) only won bets(status = 3), where all filters, where service = null', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],

            where: {
                status: [3],
                service: null,
                betType: ['ordinary', 'express']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    it('(+) only opened bets(status != 0), where all filters, where service = null', async () => {

        await userList.login_with_RUB();
        const {data} = await socket.send('BETS:bets-history', {
            language: null,
            limit: [0, 20],
            order: ['id', 'DESC'],

            where: {
                status: [1, 2, 3],
                service: null,
                betType: ['ordinary', 'express']
            }
        });
        // console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    it('(-) 0 limits, where all filters, where service = null', async () => {

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
        expect(Object.entries(betsMap).length).equal(0);
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
        expect(Object.entries(betsMap).length).equal(0);
    });

    //TODO fix expect
    it.skip('(-) 5 limits + 5 offset, where all filters, where service = null', async () => {

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
        console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });

    //TODO fix expect
    it.skip('(+) 5 limits + 2 offset, where all filters, where service = null', async () => {

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
        console.log(data);
        expect(data.totalCount).equal(0);
        expect(data.betsMap).to.be.empty;
    });
});
