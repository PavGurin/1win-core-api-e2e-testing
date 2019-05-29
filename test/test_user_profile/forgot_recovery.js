import {expect} from 'chai';

describe('Profile check auth recovery', () => {

    const testingEmail = 'testing_recovery@test.xyz';
    const testingPhone = '+79110000001';

    it('(+) recovery by email', async () => {
        const {data} = await socket.send('USER:forgot-recovery', {
                account: testingEmail
            }
        );
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.userId).equal(461);
        expect(data.email).satisfies(email => email.startsWith(testingEmail.substr(0, 2)))
                          .and.satisfies(email => email.endsWith(testingEmail.substr(15)));
    });

    it('(+) recovery by phone', async () => {
        const {data} = await socket.send('USER:forgot-recovery', {
                account: testingPhone
            }
        );
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.userId).equal(461);
        expect(data.email).satisfies(email => email.startsWith(testingEmail.substr(0, 2)))
                          .and.satisfies(email => email.endsWith(testingEmail.substr(15)));
    });

    it('(-) nonexistent user', async () => {
        // восстановление пароля с несуществующим пользователем должно возвращать ошибку
        try {
            const {data} = await socket.send('USER:forgot-recovery', {
                account: 'nonexistent_user'
            });
            expect('но не упал').equal('Тест должен упасть');
        } catch (e) {
            expect(true).equal(true);
        }
    });
});
