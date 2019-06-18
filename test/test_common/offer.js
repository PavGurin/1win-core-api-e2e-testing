import {expect} from "chai"

describe.skip("Offers", () => {


    it("- (+) valid request offer 1", async () => {
        const {data} = await socket.send("COMMON:offer-1", {});

        console.log(data);
        expect(data).equal({});
    });

    it("- (+) valid request offer 2", async () => {
        const {data} = await socket.send("COMMON:offer-2", {});

        console.log(data);
        expect(data).equal({});
    });

    it("- (+) valid request offer 3", async () => {
        const {data} = await socket.send("COMMON:offer-3", {});

        console.log(data);
        expect(data).equal({});
    });

});
