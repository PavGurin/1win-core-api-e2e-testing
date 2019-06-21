import {expect} from "chai";

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