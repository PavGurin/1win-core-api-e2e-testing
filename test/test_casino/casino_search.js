import { expect } from "chai"



describe("///////////////////casino search check ///////////////////////////", () => {

    it("////////////////////bets make ordinar//////////////////", async () => {
        const { data } = socket.send("CASINO:games-search",{

        })
       
        console.log(data);
     // expect(data.message).to.equal(undefined);
    })


})















