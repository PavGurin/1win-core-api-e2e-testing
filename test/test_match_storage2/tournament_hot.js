import {expect} from "chai"

describe("Tournament hot", () => {


    it("- Tournament hot without parameters ", async () => {
        const {data} = await socket.send("MATCH-STORAGE-2:tournament-hot", {});

        //console.log(data);
        expect(data).not.equal(null);
    });

});
