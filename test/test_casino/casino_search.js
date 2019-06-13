import {expect} from "chai"

describe("Casino search check @master", () => {

    //TODO нужно разобраться почему 500 и завести задачу на бэк
    it("C20487 - Games-search @master", async () => {
        const { data } = await socket.send("CASINO-2:games-search",{
        });

        //console.log(data[0]);
        expect(data["0"].provider).equal('casino');
    });


    it("C20488 Categories-all", async () => {
        const { data } = await socket.send("CASINO-2:categories-all",{
        });
        //console.log(data[0]);
        expect(data["0"].count).not.equal(null);

    });


    it("C20489 - Games-all", async () => {
        const { data } =   await socket.send("CASINO-2:games-all",{
            limit: [0,1000],
            where: {

            },
            lang: "ru",
            isOnlyMobile: false
          });
        //console.log(data[0]);
        expect(data["0"].id).not.equal(null);
    })

});
