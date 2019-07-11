// методы для работы с почтой
// описание использованного api https://www.ahem.email/help/api

import axios from 'axios';

export const mail = {
  // получение токена для запросов
  async getToken() {
    const tokenData = await axios.post('https://www.ahem.email/api/auth/token', {}, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    // console.log(tokenData);
    return tokenData.data.token;
  },

  // получение доступного домена
  async getDomain() {
    const token = await mail.getToken();
    const properties = await axios.get('https://www.ahem.email/api/properties', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(properties);
    return properties.data.allowedDomains[0];
  },

  // получение письма и кода из него
  // возвращает объект со свойствами:
  //    subject - тема письма
  //    text - текст письма
  //    from_address - адрес отправителя письма
  //    from_name - имя отправителя письма
  //    code - код подтверждения из письма
  async getMessage(emailAddress) {
    const token = await mail.getToken();
    const mailbox = emailAddress.match(/.*(?=@ahem.email)/)[0];
    const mailboxData = await axios.get(`https://www.ahem.email/api/mailbox/${mailbox}/email`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    const mailData = await axios.get(`https://www.ahem.email/api/mailbox/${mailbox}/email/${mailboxData.data[0].emailId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    const message = {};
    message.subject = mailData.data.subject;
    message.text = mailData.data.html;
    message.from_address = mailData.data.from.value[0].address;
    message.from_name = mailData.data.from.value[0].name;
    // получаем из текста письма 7 цифр подряд, после которых нет
    // точки, символа доллара, рубля или евро
    message.code = message.text.match(/\d\d\d\d\d\d\d(?!\.|\$|₽|€|@)/)[0];
    // console.log(message);
    await mail.deleteMessage(mailbox, mailboxData.data[0].emailId);
    return message;
  },


  // удаление письма
  async deleteMessage(emailAddress, mailId) {
    const token = await mail.getToken();
    return axios.delete(`https://www.ahem.email/api/mailbox/${emailAddress}/email/${mailId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
