import {expect} from "chai"

describe("Sport-tournaments", () => {


    it("- Sport-tournaments prematch", async () => {
        const {data} = await socket.send("MATCH-STORAGE-2:sport-tournaments", {
            service: 'prematch',
            sportId: 'all',
            timeFilter: {
                date: false,
                hour: false
            }
        });

        //console.log(data);
        expect(data.service).equal('prematch');
    });

    it("- Sport-tournaments live", async () => {
        const {data} = await socket.send("MATCH-STORAGE-2:sport-tournaments", {
            service: 'live',
            sportId: 'all',
            timeFilter: {
                date: false,
                hour: false
            }
        });

        //console.log(data);
        expect(data.service).equal('live');
    });

});