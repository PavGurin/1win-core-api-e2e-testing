import { expect } from "chai"

var token_val;

describe("///////////////////profile check///////////////////////////", () => {

      
    it("////////////////////auth login from mail!!!!!////////////////////", async () => {
        const { data } = await socket.send("PROFILE:auth-login",{login:'testsocke777@yandex.ru',password:'qwerty777'});
       // expect(data).to.be.a('array')
        console.log(data);
        token_val = data.token;

    })
      


    it("////////////////////profile update////////////////////", async () => {

        await socket.setToken(token_val);
        const { data } = await socket.send("PROFILE:profile-update",{
 
            country: 'RU',
            userId: 1026429, 
            timezone: 32234124125,
            name: 'testsocke777',
            email: 'testsocke777@yandex.ru',
            phone: '57544564564976',
            password: 'qwerty999',
            repeat_password: 'qwerty999',
            birthday: 347190318
        
        }
        );
        
       // expect(data).to.be.a('array')
        console.log(data);
    })

})
