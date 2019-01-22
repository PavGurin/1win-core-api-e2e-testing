import { expect } from "chai"

describe("///////////////////profile check recovery forgot///////////////////////////", () => {


    it("////////////////////profile recovery recovery forgot confirm/////////////////", async () => {
        const { data } = await socket.send("PROFILE:forgot-confirm",{
 
            userId: 1026429, 
            code: 9365724,
            password: 'qwerty777'
        
    
        }
        );
        expect(data.message).to.equal(undefined);


    })

})

