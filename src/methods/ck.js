const { ClickHouse } = require('clickhouse');

const clickhouse = new ClickHouse({
  url: 'https://clickhouse.1win.cloud:443/',
  port: 443,
  basicAuth: {
    username: 'default',
    password: 'Ua6MNch2vKcuSD4dAhMRtcGStkuNn4',
  },
  config: {
    database: 'default',
  },
});

export const ck = {
  async ckQuery(query) {
    const rows = await clickhouse.query(query).toPromise();
    return rows;
  },
};
