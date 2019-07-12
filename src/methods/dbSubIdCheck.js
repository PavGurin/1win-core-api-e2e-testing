import { expect } from 'chai';
import { mysqlConnection } from './mysqlConnection';

// проверка наличия subId в таблицах 1win.ma_users_meta и 1win_partner.stats_v2
// параметры:
// userId - id пользователя
// eventName - название события, с которым должна быть запись в stats
// expectedSubIds - объект, содержащий пары subId - значение
// пример вызова:     await successDbSubIdCheck(data.id, 'REGISTRATION', {
//       sub1: 'sub_1',
//       sub3: 'sub_3',
//       sub5: 'sub_5',
//     });
export async function dbSubIdCheck(userId, eventName, expectedSubIds) {
  const userMeta = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta WHERE id_user = ${userId} AND ma_users_meta.key = 'SUB_IDS';`);
  const stats = await mysqlConnection.executeQuery(`SELECT * FROM 1win_partner.stats_v2 WHERE user_id = ${userId} AND event = '${eventName}';`);

  // для каждой переданной пары subId - значение
  (Object.entries(expectedSubIds)).forEach((subIdPair, i, arr) => {
    // если значение этого subid не null
    if (subIdPair[1] !== null) {
      // в таблице ma_users_meta в столбце value должно быть "subid":"значение"
      expect(userMeta[0].value.includes(`"${subIdPair[0]}":"${subIdPair[1]}"`)).to.equal(true);
      // если null
    } else {
      // в таблице ma_users_meta в столбце value этого subid не должно быть
      expect(userMeta[0].value.includes(`"${subIdPair[0]}"`)).to.equal(false);
    }

    // в таблице stats_v2 значение соответствующего subid должно быть равно переданному
    expect((stats[0])[(subIdPair[0])]).to.equal(subIdPair[1]);
    // console.log(`${subIdPair[0]}: ${subIdPair[1]}`);
  });
}

// проверка, что все sub id пустые
export async function emptyDbSubIdCheck(userId, eventName) {
  const userMeta = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta WHERE id_user = ${userId} AND ma_users_meta.key = 'SUB_IDS';`);
  const stats = await mysqlConnection.executeQuery(`SELECT * FROM 1win_partner.stats_v2 WHERE user_id = ${userId} AND event = '${eventName}';`);
  expect(userMeta[0].value).to.equal('{}');
  expect(stats[0].sub1).to.equal(null);
  expect(stats[0].sub2).to.equal(null);
  expect(stats[0].sub3).to.equal(null);
  expect(stats[0].sub4).to.equal(null);
  expect(stats[0].sub5).to.equal(null);
}
