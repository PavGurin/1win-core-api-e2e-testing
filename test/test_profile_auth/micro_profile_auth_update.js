import { expect } from "chai"

describe("Profile check micro profile auth", () => {

    it("Auth login from mail", async () => {
        const { data } = await socket.send("POST:login",{login:'testsocke777@yandex.ru',password:'qwerty777'});

        await socket.send("USER:updatePersonalData",{

            birthday: 880405200000,
            country: 'ru',
            email: 'testsocke777@yandex.ru',
            name: 'testsocke777777',
            new_password: null,
            password: 'qwerty777',
            phone: '57544564564976',
            repeat_password: 'qwerty777',
            timezone: -3
        }
        );
        expect(data.message).to.equal(undefined);
    })

})
