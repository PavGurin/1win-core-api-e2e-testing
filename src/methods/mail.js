// методы для работы с почтой

// описание тут https://rapidapi.com/Privatix/api/temp-mail
// следить за количеством запросов тут https://dashboard.rapidapi.com/billing
// токен для отправки запросов 0b48a4497amsh0cccc524b8436bfp167b9ejsnb5deb31896ca
// !!! ВАЖНО !!! бесплатно можно отправить только сто запросов в день!
// один вызов get_message - это два запроса (получение и удаление письма), т.е. вызывать get_message можно не более 50 раз в день
// новый "день" начинается в 15:00 по москве

// пример использования:
// const received = await mail.get_message('fodiwotitu@virtualemail.info');
// await console.log(received.code);


import axios from 'axios';
import md5 from 'md5';

export const mail = {

  // получение письма и кода из него
  // возвращает объект со свойствами:
  // subject - тема письма
  // text - текст письма
  // code - код подтверждения из письма
  async get_message(emailAddress) {
    const result = await axios.get(`https://privatix-temp-mail-v1.p.rapidapi.com/request/mail/id/${md5(emailAddress)}/format/json`, {
      headers: {
        'X-RapidAPI-Host': 'privatix-temp-mail-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '0b48a4497amsh0cccc524b8436bfp167b9ejsnb5deb31896ca',
      },
    });
    const message = {};
    message.subject = result.data['0'].mail_subject;
    message.text = result.data['0'].mail_text_only;
    message.code = message.text.match(/\d\d\d\d\d\d\d(?!\.|\$|\₽|\€|\@)/)[0];
    await mail.delete_message(result.data['0'].mail_id);
    return message;
  },


  // удаление письма по id
  async delete_message(mailId) {
    return await axios.get(`https://privatix-temp-mail-v1.p.rapidapi.com/request/delete/id/${mailId}/`, {
      headers: {
        'X-RapidAPI-Host': 'privatix-temp-mail-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '0b48a4497amsh0cccc524b8436bfp167b9ejsnb5deb31896ca',
      },
    });
  },
};
