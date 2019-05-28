import {expect} from 'chai';

describe('Profile check click/mail', () => {

    it('Auth login from 1 click', async () => {
        const {data} = await socket.send('POST:login', {login: 'bahc21@1win.xyz', password: '107pi8'});
        expect(data.message)
            .to
            .equal(undefined);
    });

    it('Auth login from mail', async () => {
        const {data} = await socket.send('POST:login', {login: '123123@mailinator.com', password: '123123'});
        expect(data.message)
            .to
            .equal(undefined);
    });

});
