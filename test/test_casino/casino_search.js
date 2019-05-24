import { expect } from "chai"

describe("Casino search check", () => {

    it("Games-search", async () => {
        const { data } = await socket.send("CASINO-2:games-search",{

        })

       //вывод логов в консоль
       console.log(data[0]);

        expect(data).to.be.an('array');
        expect(data[0].name).to.be.an('object');
        expect(data.message).to.equal(undefined);

    })



    it("Categories-all", async () => {
        const { data } = await socket.send("CASINO-2:categories-all",{

        });

        console.log(data[0]);
        expect(data).to.be.an('array');
        expect(data[0].Name).to.be.an('object');
        expect(data.message).to.equal(undefined);
    })


    it("Games-all", async () => {
        const { data } =   await socket.send("CASINO-2:games-all",{
            limit: [0,1000],
            where: {


            },
            lang: "ru",
            isOnlyMobile: false
          })
        console.log(data[0]);
        expect(data).to.be.an('array');
        expect(data[0].name).to.be.an('object');
        expect(data.message).to.equal(undefined);
    })

})
