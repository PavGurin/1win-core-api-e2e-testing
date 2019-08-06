import { logOut } from './user';
import { register } from './register';
import { mysqlConnection } from './mysqlConnection';

export const userPool = {

  async usersWithBalanceRubAndConfirmCodes(usersNumber, balanceAmount) {
    const users = [];
    let query = `UPDATE 1win.ma_balance SET amount = ${balanceAmount} WHERE id_user in(`;
    for (let i = 0; i < usersNumber; i++) {
      /* eslint no-await-in-loop: 'off' */
      await logOut();
      const newUser = await register.regMailWithConfirmationCodes();
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
};