import {expect} from 'chai';

describe('Profile check auth recovery', () => {

    const testingEmail = 'testing_recovery@test.xyz';
    const testingPhone = '+79110000001';

    it('(+) recovery by email', async () => {
        const {data} = await socket.send('POST:forgot_password', {
                account: testingEmail
            }
        );
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.status).equal(200);
        expect(data.email).satisfies(email => email.startsWith(testingEmail.substr(0, 2)))
                          .and.satisfies(email => email.endsWith(testingEmail.substr(5)));
    });

    it('(+) recovery by phone', async () => {
        const {data} = await socket.send('POST:forgot_password', {
                account: testingPhone
            }
        );
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.status).equal(200);
        expect(data.email).satisfies(email => email.startsWith(testingEmail.substr(0, 2)))
                          .and.satisfies(email => email.endsWith(testingEmail.substr(15)));
    });

});
