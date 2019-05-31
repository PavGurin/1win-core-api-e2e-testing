import {expect} from 'chai';

describe('Auth recovery forgot', () => {

    const testingEmail = 'kalliak1993@yandex.ru';
    const testingPhone = '+79110994202';
    const default_id = 1490385;

    it('C19318 (+) recovery by email', async () => {
        const {data} = await socket.send('USER:forgot-recovery', {
                account: testingEmail
            }
        );
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.userId).equal(default_id);
        expect(data.email).satisfies(email => email.startsWith(testingEmail.substr(0, 2)))
                          .and.satisfies(email => email.endsWith(testingEmail.substr(15)));
    });

    it('C19319 (+) recovery by phone', async () => {
        const {data} = await socket.send('USER:forgot-recovery', {
                account: testingPhone
            }
        );
        console.log(data);
        expect(data).to.be.an('object');
        expect(data.userId).equal(810);
        expect(data.email).satisfies(email => email.startsWith(testingEmail.substr(0, 2)))
                          .and.satisfies(email => email.endsWith(testingEmail.substr(15)));
    });

    it('C19320 (-) nonexistent user', async () => {
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

    //TODO  ожидает фикса
    it.skip('C19321 (-) empty account field', async () => {
        const {status: status} = await socket.send('USER:forgot-recovery', {
                account: ''
            }
        );
        console.log('response status:' + status);
        expect(status).not.to.equal(200);
    });
});
