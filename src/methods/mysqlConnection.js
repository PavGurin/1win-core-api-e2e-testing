// метод для работы с бд
// пример использования:
// const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits ;`);

const mysql = require('mysql2/promise');

export const mysqlConnection = {

  // возвращает массив - результат запроса в бд
  // параметры:
  // query - запрос, который нужно выполнить
  // необязательные параметры:
  // environment - окружение, на котором выполняются тесты, по умолчанию staging
  // dbName - база, в которой надо выполнить запрос, по умолчанию 1win,
  // для партнерки база 1win_partner
  async executeQuery(query, environment = 'staging', dbName = '1win') {
    const connection = await mysqlConnection.dbConnect(environment, dbName);
    const [rows] = await connection.query(query);
    await connection.end();
    return rows;
  },

  // вспомогательная функция для установки параметров подключения (окружение и база)
  async dbConnect(environment = 'staging', dbName = '1win') {
    let connection = {};
    // в будущем можно будет добавить другие окружения и базы, если будет нужно
    switch (environment) {
      case 'staging':
        connection = await mysql.createConnection({
          host: 'backend.1win-prodlike.tech',
          user: '1win',
          password: '1wintestuser123',
          database: dbName,
        });
        break;
      default:
        connection = await mysql.createConnection({
          host: 'backend.1win-prodlike.tech',
          user: '1win',
          password: '1wintestuser123',
          database: '1win',
        });
        break;
    }
    return connection;
  },
};
