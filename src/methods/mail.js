// методы для работы с почтой
// описание использованного api https://www.ahem.email/help/api

/* eslint no-console:off */
import axios from 'axios';

export const mail = {
  // получение токена для запросов
  async getToken() {
    try {
      const { data } = await axios.post('https://www.ahem.email/api/auth/token', {}, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      // console.log(data);
      return data.token;
    } catch (e) {
      console.log(e);
      return null;
    }
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
    try {
      const { data: mailBox } = await axios.get(`https://www.ahem.email/api/mailbox/${mailbox}/email`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const { data } = await axios.get(`https://www.ahem.email/api/mailbox/${mailbox}/email/${mailBox[0].emailId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const message = {};
      message.subject = data.subject;
      message.text = data.html;
      message.from_address = data.from.value[0].address;
      message.from_name = data.from.value[0].name;

      // получаем из текста письма 7 цифр подряд, после которых нет
      // точки, символа доллара, рубля или евро
      const regexpMatch = message.text.match(/\d\d\d\d\d\d\d(?!\.|\$|₽|€|@)/);
      // если кода нет, возвращаем -1 в этом поле
      if (regexpMatch) {
        // eslint-disable-next-line prefer-destructuring
        message.code = regexpMatch[0];
      } else message.code = -1;
      // console.log(message);
      await mail.deleteMessage(mailbox, mailBox[0].emailId, token);
      return message;
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  // удаление письма
  async deleteMessage(emailAddress, mailId, token) {
    try {
      await axios.delete(`https://www.ahem.email/api/mailbox/${emailAddress}/email/${mailId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.log(e);
    }
  },
};
