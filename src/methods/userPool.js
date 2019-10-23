import { logOut } from './user';
import { register } from './register';
import { mysqlConnection } from './mysqlConnection';
import { banking } from './banking';

export const userPool = {

  async usersWithBalanceRubAndConfirmCodes(socket, usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut(socket);
      const newUser = await register.regMailWithConfirmationCodes(socket);
      users.push({
        email: newUser.data.email,
        password: newUser.data.password,
        id: newUser.data.user_id,
        balance: balanceAmount,
      });
      query += `${newUser.data.user_id}`;
      if (i !== (usersNumber - 1)) query += ', ';
    }
    query += ');';
    // console.log(users);
    // console.log(query);

    await mysqlConnection.executeQuery(query);
    return users;
  },
  async usersWithBalanceRub(socket, usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut(socket);
      const newUser = await register.usualReg(socket);
      users.push({
        email: newUser.data.email,
        password: newUser.data.password,
        id: newUser.data.user_id,
        balance: balanceAmount,
      });
      query += `${newUser.data.user_id}`;
      if (i !== (usersNumber - 1)) query += ', ';
    }
    query += ');';
    // console.log(users);
    // console.log(query);

    await mysqlConnection.executeQuery(query);
    return users;
  },
  async usersWithBalanceUsd(socket, usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut(socket);
      const newUser = await register.oneClickRegUSD(socket);
      users.push({
        email: newUser.data.email,
        password: newUser.data.password,
        id: newUser.data.user_id,
        balance: balanceAmount,
      });
      query += `${newUser.data.user_id}`;
      if (i !== (usersNumber - 1)) query += ', ';
    }
    query += ');';
    // console.log(users);
    // console.log(query);

    await mysqlConnection.executeQuery(query);
    return users;
  },
  async usersWithBalanceEur(socket, usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut(socket);
      const newUser = await register.oneClickRegEUR(socket);
      users.push({
        email: newUser.data.email,
        password: newUser.data.password,
        id: newUser.data.user_id,
        balance: balanceAmount,
      });
      query += `${newUser.data.user_id}`;
      if (i !== (usersNumber - 1)) query += ', ';
    }
    query += ');';
    // console.log(users);
    // console.log(query);

    await mysqlConnection.executeQuery(query);
    return users;
  },
  async usersWithEmailMailru(socket, usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut(socket);
      const newUser = await register.usualRegMailru(socket);
      users.push({
        email: newUser.data.email,
        password: newUser.data.password,
        id: newUser.data.user_id,
        balance: balanceAmount,
      });
      query += `${newUser.data.user_id}`;
      if (i !== (usersNumber - 1)) query += ', ';
    }
    query += ');';
    // console.log(users);
    // console.log(query);

    await mysqlConnection.executeQuery(query);
    return users;
  },

  // для генерации юзеров с депозитами в рублях
  async usersWithDepositRub(socket, usersNumber, depositAmount, depositNumber = 1) {
    const users = await userPool.usersWithEmailMailru(socket,
      usersNumber, depositAmount * depositNumber);
    const date = new Date();
    users.forEach(async (user) => {
      for (let i = 1; i <= depositNumber; i++) {
        await banking.createDepositInBD(user.id, depositAmount, date, 'mts_rub', '9119998877', 1);
      }
    });
    return users;
  },

  // для генерации юзеров, которым был трасфер в рублях
  async usersWithTransferRub(socket, usersNumber, depositAmount, depositNumber = 1) {
    const users = await userPool.usersWithEmailMailru(socket,
      usersNumber, depositAmount * depositNumber);
    const date = new Date();
    users.forEach(async (user) => {
      for (let i = 1; i <= depositNumber; i++) {
        await banking.createDepositInBD(user.id, depositAmount, date, 'money-transfer', 'sender: 136', 1);
      }
    });
    return users;
  },


  // для генерации юзеров с депозитами в долларах
  async usersWithDepositUSD(socket, usersNumber, depositAmount, depositNumber = 1) {
    const users = await userPool.usersWithBalanceUsd(socket,
      usersNumber, depositAmount * depositNumber);
    const date = new Date();
    users.forEach(async (user) => {
      for (let i = 1; i <= depositNumber; i++) {
        await banking.createDepositInBDUSD(user.id, depositAmount, date, 'card', '3636595984847171', 1);
      }
    });
    return users;
  },
};
