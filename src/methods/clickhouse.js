const { ClickHouse } = require('clickhouse');

const ck = new ClickHouse({
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

export const clickhouse = {
  async ckQuery(query) {
    const rows = await ck.query(query).toPromise();
    return rows;
  },
};
