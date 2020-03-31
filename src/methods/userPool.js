import { logOut } from './user';
import { register } from './register';
import { mysqlConnection } from './mysqlConnection';
import { banking } from './banking';

export const userPool = {

  async usersWithBalanceRubAndConfirmCodes(usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut();
      const newUser = await register.regMailWithConfirmationCodes();
      if (newUser.data.user_id && newUser.data.email && newUser.data.password) {
        users.push({
          email: newUser.data.email,
          password: newUser.data.password,
          id: newUser.data.user_id,
          balance: balanceAmount,
        });
        query += `${newUser.data.user_id}`;
        if (i !== (usersNumber - 1)) query += ', ';
      } else { i--; }
    }
    query += ');';
    // console.log(users);
    // console.log(query);

    await mysqlConnection.executeQuery(query);
    return users;
  },
  async usersWithBalanceRub(usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut();
      const newUser = await register.usualReg();
      if (newUser.data.user_id && newUser.data.email && newUser.data.password) {
        users.push({
          email: newUser.data.email,
          password: newUser.data.password,
          id: newUser.data.user_id,
          balance: balanceAmount,
        });
        query += `${newUser.data.user_id}`;
        if (i !== (usersNumber - 1)) query += ', ';
      } else { i--; }
    }
    query += ');';
    // console.log(users);
    // console.log(query);

    await mysqlConnection.executeQuery(query);
    return users;
  },
  async usersWithBalanceUsd(usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut();
      const newUser = await register.oneClickRegUSD();
      if (newUser.data.user_id && newUser.data.email && newUser.data.password) {
        users.push({
          email: newUser.data.email,
          password: newUser.data.password,
          id: newUser.data.user_id,
          balance: balanceAmount,
        });
        query += `${newUser.data.user_id}`;
        if (i !== (usersNumber - 1)) query += ', ';
      } else { i--; }
    }
    query += ');';
    // console.log(users);
    // console.log(query);

    await mysqlConnection.executeQuery(query);
    return users;
  },
  async usersWithBalanceEur(usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut(socket);
      const newUser = await register.oneClickRegEUR(socket);
      if (newUser.data.user_id && newUser.data.email && newUser.data.password) {
        users.push({
          email: newUser.data.email,
          password: newUser.data.password,
          id: newUser.data.user_id,
          balance: balanceAmount,
        });
        query += `${newUser.data.user_id}`;
        if (i !== (usersNumber - 1)) query += ', ';
      } else { i--; }
    }
    query += ');';
    // console.log(users);
    // console.log(query);

    await mysqlConnection.executeQuery(query);
    return users;
  },
  async usersWithEmailMailru(usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut();
      const newUser = await register.usualRegMailru();
      if (newUser.data.user_id && newUser.data.email && newUser.data.password) {
        users.push({
          email: newUser.data.email,
          password: newUser.data.password,
          id: newUser.data.user_id,
          balance: balanceAmount,
        });
        query += `${newUser.data.user_id}`;
        if (i !== (usersNumber - 1)) query += ', ';
      } else { i--; }
    }
    query += ');';
    // console.log(users);
    // console.log(query);

    await mysqlConnection.executeQuery(query);
    return users;
  },

  // для генерации юзеров с депозитами в рублях
  async usersWithDepositRub(usersNumber, depositAmount, depositNumber = 1) {
    const users = await userPool.usersWithEmailMailru(
      usersNumber, depositAmount * depositNumber,
    );
    const date = new Date();
    users.forEach(async (user) => {
      for (let i = 1; i <= depositNumber; i++) {
        await banking.createDepositInBD(user.id, 'RUB', depositAmount, date, 'mts_rub', '9119998877', 1);
      }
    });
    return users;
  },

  // для генерации юзеров, которым был трасфер в рублях
  async usersWithTransferRub(usersNumber, depositAmount, depositNumber = 1) {
    const users = await userPool.usersWithEmailMailru(
      usersNumber, depositAmount * depositNumber,
    );
    const date = new Date();
    users.forEach(async (user) => {
      for (let i = 1; i <= depositNumber; i++) {
        await banking.createDepositInBD(user.id, 'RUB', depositAmount, date, 'money-transfer', 'sender: 136', 1);
      }
    });
    return users;
  },


  // для генерации юзеров с депозитами в долларах
  async usersWithDepositUSD(usersNumber, depositAmount, depositNumber = 1) {
    const users = await userPool.usersWithBalanceUsd(
      usersNumber, depositAmount * depositNumber,
    );
    const date = new Date();
    users.forEach(async (user) => {
      for (let i = 1; i <= depositNumber; i++) {
        await banking.createDepositInBD(user.id, 'USD', depositAmount, date, 'card', '3636595984847171', 1);
      }
    });
    return users;
  },
};
