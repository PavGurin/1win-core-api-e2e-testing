import { expect } from "chai"

describe("Profile check  micro profile auth", () => {

    it("Auth login from mail", async () => {
        const { data } = await socket.send("PROFILE:auth-login",{login:'testsocke777@yandex.ru',password:'qwerty777'});

        await socket.send("PROFILE:profile-update",{

            country: 'RU',
           // userId: 1026429,
            timezone: 32234124125,
            name: 'testsocke777777',
            email: 'testsocke777@yandex.ru',
            phone: '57544564564976',
            password: 'qwerty999',
            repeat_password: 'qwerty999',
            birthday: 347190318

        }
        );
        expect(data.message).to.equal(undefined);
    })

})
