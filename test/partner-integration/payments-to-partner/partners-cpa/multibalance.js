// TODO тесты на мультибланс

// import { register } from '../../../../src/methods/register';
// import { addDeposit, addFirstDeposit } from '../../../../src/methods/partnerInDB';
// import { banking } from '../../../../src/methods/banking';
// import { cases } from '../../../../src/methods/cases';
//
// it('cpa multibalance', async () => {
//   // const { cookie } = await partner.login('cpa_multi@ahem.email', defaultPass);
//
//   for (let i = 0; i < 10; i++) {
//     const { data: user } = await register.oneClickRegRubWithPromocode('11556688');
//     await addFirstDeposit(9095, 7519, 9216, user.id, 5000);
//     await addDeposit(9095, 7519, 9216, user.id, 5000);
//     console.log(user.id);
//     await banking.setBalance(user.id, 5000);
//     for (let j = 0; j < 5; j++) {
//       const { data: caseWin } = await cases.playCaseWithoutChance(THOUSAND_ROUBLES_CASE_ID);
//       console.log(caseWin);
//     }
//   }
// });
