import {expect} from "chai"

describe("Sport categories", () => {


    it("C21148 - (+) valid request prematch", async () => {
        const {data} = await socket.send("MATCH-STORAGE-2:sport-categories", {
            service: 'prematch',
            sportId: 'all',
            timeFilter: {
                date: false,
                hour: false
            }
        });
        //console.log(data);
        expect(data.service).equal('prematch');
        // expect(data.sportCategoriesMap["0"].categoryIconFileId).not.equal(null);
        expect(data.sportCategoriesMap["0"].categoryId).not.equal(null);
        expect(data.sportCategoriesMap["0"].categoryName.en).not.equal(null);
        expect(data.sportCategoriesMap["0"].categoryName.ru).not.equal(null);
        expect(data.sportCategoriesMap["0"].sportId).not.equal(null);
        expect(data.sportCategoriesMap["0"].sportName.en).not.equal(null);
        expect(data.sportCategoriesMap["0"].sportName.ru).not.equal(null);
    });

    it("C21149 - (+) valid request live @master", async () => {
        const {data} = await socket.send("MATCH-STORAGE-2:sport-categories", {
            service: 'live',
            sportId: 'all',
            timeFilter: {
                date: false,
                hour: false
            }
        });
        //console.log(data);
        expect(data.service).equal('live');
        expect(data.sportCategoriesMap["0"].categoryIconFileId).not.equal(null);
        expect(data.sportCategoriesMap["0"].categoryId).not.equal(null);
        expect(data.sportCategoriesMap["0"].categoryName.en).not.equal(null);
        expect(data.sportCategoriesMap["0"].categoryName.ru).not.equal(null);
        expect(data.sportCategoriesMap["0"].sportId).not.equal(null);
        expect(data.sportCategoriesMap["0"].sportName.en).not.equal(null);
        expect(data.sportCategoriesMap["0"].sportName.ru).not.equal(null);
    });

});

