import {expect} from "chai"

describe("MATCH-TRANSLATIONS", () => {


    it("- (+) valid request", async () => {
        const {data} = await socket.send("MATCH-TRANSLATIONS:translations", {});

        //console.log(data);
        expect(data.transaction).include([]);
    });

});
