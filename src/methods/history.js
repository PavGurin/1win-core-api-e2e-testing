import { mysqlConnection } from './mysqlConnection';

export const history = {

  async categories() {
    return socket.send('USER:history-categories', {});
  },

  async category(categoryName) {
    return socket.send(`USER:history-${categoryName}`, {});
  },

  async categoryWithLimit(categoryName, recordsLimit) {
    return socket.send(`USER:history-${categoryName}`, {
      limit: recordsLimit,
    });
  },

  async categoryWithLastId(categoryName, id) {
    return socket.send(`USER:history-${categoryName}`, {
      lastId: id,
    });
  },

  async categoryWithLimitAndLastId(categoryName, recordsLimit, id) {
    return socket.send(`USER:history-${categoryName}`, {
      limit: recordsLimit,
      lastId: id,
    });
  },

  async getDepositsIds(userId) {
    const result = await mysqlConnection.executeQuery(`SELECT id FROM 1win.ma_deposits WHERE id_user = ${userId}`);
    // console.log(result);
    return result;
  },
};
