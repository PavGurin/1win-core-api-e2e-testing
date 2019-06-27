import {expect} from 'chai';

describe('MATCH-TRANSLATIONS', () => {
    it('C21144 - (+) valid request', async () => {
        const {data} = await socket.send('MATCH-TRANSLATIONS:translations', {});

        // console.log(data);
        expect(data.transaction).include([]);
    });
});
