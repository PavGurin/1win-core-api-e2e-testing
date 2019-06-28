// методы для работы с почтой
// описание тут https://rapidapi.com/Privatix/api/temp-mail
// токен для отправки запросов 0b48a4497amsh0cccc524b8436bfp167b9ejsnb5deb31896ca
// !!! ВАЖНО !!! бесплатно можно отправить только сто запросов в день! т.е. вызовов функций из этого файла может быть не более 100 в день
// новый "день" начинается в 15:00 по москве

import axios from 'axios';
import md5 from 'md5';
//import unirest from "unirest";

export const mail = {

    // получение письма и кода из него
    // возвращает объект со свойствами:
    // subject - тема письма
    // text - текст письма
    // code - код из письма
    // id - id письма
    async get_message (emailAddress){
        //var md5Email = md5(emailAddress);

        const result = await axios.get(`https://privatix-temp-mail-v1.p.rapidapi.com/request/mail/id/${md5(emailAddress)}/format/json`, {
            headers: {
                "X-RapidAPI-Host": "privatix-temp-mail-v1.p.rapidapi.com",
                "X-RapidAPI-Key": "0b48a4497amsh0cccc524b8436bfp167b9ejsnb5deb31896ca",
            }
        })

        let message = {};

        message.subject = result.data["0"].mail_subject;
        message.text = result.data["0"].mail_text_only;
        message.id = result.data["0"].mail_id;
        message.code = message.text.match(/\d\d\d\d\d\d\d/)[0];

        //message.code = (result.data["0"].mail_text_only).split(": ")["1"];
        //switch (message.subject) {
            //case "1Win - Подтверждение перевода":
                //const reg = /\d\d\d\d\d\d\d/;
                //message.code = message.text.match(reg)[0];
                //message.code = message.text.getElementsByClassName("code");
                //break;
            //case  "1Win - Password recovery":
                //message.code = (result.data["0"].mail_text_only).split(": ")["1"];
                //break;
            //default:
                //message.code = "error";
                //break;
        //}

        return message;
    },

    //удаление письма по id
    //id - это то что возвращает  get_message в поле id)
    async delete_message(mailId){
        await unirest.get("https://privatix-temp-mail-v1.p.rapidapi.com/request/delete/id/" + mailId + "/")
            .header("X-RapidAPI-Host", "privatix-temp-mail-v1.p.rapidapi.com")
            .header("X-RapidAPI-Key", "0b48a4497amsh0cccc524b8436bfp167b9ejsnb5deb31896ca")
            .end(function (result) {
                //console.log(result.status, result.headers, result.body);
            });
    }
}