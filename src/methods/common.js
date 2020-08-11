import { mysqlConnection } from './mysqlConnection';

const axios = require('axios');

export async function getTitles(params) {
  try {
    const { data } = await axios.get('https://master_staging.staging.1win-prodlike.tech/common2/titles/all', {
      params,
    });
    return data;
  } catch (e) {
    return { data: e.response.data, status: e.response.status, statusText: e.response.statusText };
  }
}
export async function insertTitles(titlesArray) {
  titlesArray.forEach(async (title) => {
    try {
      await mysqlConnection.executeQuery(`insert into 1win.ma_titles(lang, path, text, is_dynamic)
  values('${title.lang}', '${title.path}', '${title.text}', '${title.isDynamic}');`);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });
}
