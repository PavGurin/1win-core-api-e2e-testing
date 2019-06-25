import {expect} from "chai"

describe("Results", () => {

    //форматирование даты для отправки в виде дд/мм
    //daysAgo - дата за сколько дней назад от текущего будет получена
    //пример: getFormattedDate(0) - сегодняшняя дата, getFormattedDate(1) - вчерашняя
    //TODO вынести из теста
    function getFormattedDate(daysAgo) {
        var date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.getDate() + "/" + (date.getMonth() + 1);
    }

    for(var i = 0; i <=6; i++ ) {
        var date = getFormattedDate(i);
        it("C22707 - (+) results with date filtration, date: " + date, async () => {
            const {data} = await socket.send("RESULT:results-all", {
                timeFilter: {
                    date: date,
                    hoursToStart: false
                }
            })
            //console.log(data);
            expect(data).to.be.an('object');
            //TODO добавить нормальных проверок
            //expect(data[1].tournamentMap[1].matchMap[1].dateOfMatch).to.be.above(date.getUnixTimestamp());
            //expect(data[1].tournamentMap[1].matchMap[1].dateOfMatch).to.be.below((date.setDate(date.getDate()+1)).getUnixTimestamp());
        })
    }
})