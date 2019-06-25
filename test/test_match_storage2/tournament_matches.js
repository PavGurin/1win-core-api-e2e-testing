import {expect} from "chai";

describe("Tournament hot", () => {

    it("C21153 - tournament-matches live", async () => {
        const {data} = await socket.send("MATCH-STORAGE-2:tournament-matches", {
            service: 'live',
            timeFilter: {
                date: false,
                hour: false
            }
        });

        //console.log(data);
        expect(data.service).equal('live');
    });

});

describe("Tournament hot filter: prematch", () => {

    it(" - tournament-matches live 1 hour", async () => {
        const {data} = await socket.send("MATCH-STORAGE-2:tournament-matches", {
            service: 'prematch',
            timeFilter: {
                date: false,
                hoursToStart: 1
            },
            tournamentId: 'all'
        });
        //console.log(data);
        expect(data.service).equal('live');
    });

});