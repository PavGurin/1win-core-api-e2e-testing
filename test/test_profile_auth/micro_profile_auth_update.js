import { expect } from "chai"

describe("Profile check micro profile auth", () => {

    it("Save profile valid user", async () => {
        const { data } = await socket.send("POST:login",{login:'123123123123123123@mailinator.com', password:'123123123123'});

        await socket.send("USER:updatePersonalData",{

            birthday: -1372471200000,
            country: 'ru',
            email: '123123123123123123@mailinator.com',
            name: 'autotest_user',
            new_password: null,
            password: '123123123123',
            phone: '+79995654565',
            repeat_password: 'null',
            timezone: -3,
            //id_user: 1460933
        }
        );
        expect(data.message).to.equal(undefined);
    })

/* 500 при выполнении данного теста
    it("Save profile block user", async () => {
        const { data } = await socket.send("POST:login",{login:'testsocke777@yandex.ru',password:'qwerty777'});

        await socket.send("USER:updatePersonalData",{

            birthday: -1372471200000,
            country: 'ru',
            email: 'testsocke777@yandex.ru',
            name: 'autotest_user',
            new_password: null,
            password: 'qwerty777',
            phone: '+757544564564976',
            repeat_password: 'null',
            timezone: -3,
            //id_user: 1460933
        }
        );
        expect(betData).to.deep.include({status: 500});
        expect(betData).to.deep.include({messageLangKey: 'error.system'});
    })
*/
})
