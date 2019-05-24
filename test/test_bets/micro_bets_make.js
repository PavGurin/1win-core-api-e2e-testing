import { expect } from "chai"
describe("Bets check", () => {
/*
     beforeEach(function(done){
          const { data } =  socket.send("PROFILE:auth-login",{login:'rgckho@1win.xyz',password:'55s9ef'})
     });
      it("////////////////////bets auth//////////////////", async () => {
       const { data } = await login();
       expect(data.message).to.equal(undefined);
     })
*/

    it("Bets make ordinar without money", async () => {
        const { data: loginData } = await socket.send("POST:login",{login:'123123@mailinator.com', password:'123123'})

        socket.token = loginData.token;

        const { data: betData } = await socket.send("BETS:bets-make",
            {
                "currency": "RUB",
                "betsMap": {
                "prematch_16493397_386_0_Draw / No_*": {
                    "amount": 13,
                    "couponList": [
                    {
                        "service": "prematch",
                        "matchId": 16493397,
                        "typeId": 386,
                        "subTypeId": 0,
                        "outCome": "Draw / No",
                        "specialValue": "*",
                        "coefficient": "7.98"
                    }
                    ]}
                }}
        );
        console.log(loginData);
        console.log(betData);

        expect(betData).to.deep.include({status: 403});
        expect(betData).to.deep.include({message: 'Недостаточно средств'});
    })


/* describe('main page', function(){
     beforeEach(function(done){
         const login = () => socket.send("PROFILE:auth-login",{login:'rgckho@1win.xyz',password:'55s9ef'})
     });



     context('login', function(){
        it('should log the user in', function(){
         const { data } = await socket.send("BETS:bets-make",
                     {
                     "currency": "RUB",
                     "betsMap": {
                         "prematch_16493397_575_0_4+_*": {
                         "amount": 11,
                         "couponList": [
                             {
                             "service": "prematch",
                             "matchId": 16493397,
                             "typeId": 575,
                             "subTypeId": 0,
                             "outCome": "4+",
                             "specialValue": "*",
                             "coefficient": "36.9"
                             }
                         ]
                        }
                     }
                    }

             )
        });
     });


   });
*/

/*
    // it("////////////////////bets make ordinar 2////////////////////", async () => {
    //     const { data } = await  socket.send("BETS:bets-make",
    //                 {
    //                 "currency": "RUB",
    //                 "betsMap": {
    //                     "prematch_16493397_575_0_4+_*": {
    //                     "amount": 11,
    //                     "couponList": [
    //                         {
    //                         "service": "prematch",
    //                         "matchId": 16493397,
    //                         "typeId": 575,
    //                         "subTypeId": 0,
    //                         "outCome": "4+",
    //                         "specialValue": "*",
    //                         "coefficient": "36.9"
    //                         }
    //                     ]
    //                     }
    //                 }
    //                 }

    //         );
    //    expect(data.message).to.equal(undefined);
    // })

    // it("////////////////////bets make express////////////////////", async () => {
    //     const { data } = await socket.send("BETS:bets-make",
    //                     {
    //                     "currency": "RUB",
    //                     "betsMap": {
    //                         "prematch_16493397_575_0_4+_*": {
    //                         "amount": 11,
    //                         "couponList": [
    //                             {
    //                             "service": "prematch",
    //                             "matchId": 16493397,
    //                             "typeId": 575,
    //                             "subTypeId": 0,
    //                             "outCome": "4+",
    //                             "specialValue": "*",
    //                             "coefficient": "36.9"
    //                             }
    //                         ]
    //                         },
    //                         "prematch_14701051_390_0_None_*": {
    //                         "amount": 11,
    //                         "couponList": [
    //                             {
    //                             "service": "prematch",
    //                             "matchId": 14701051,
    //                             "typeId": 390,
    //                             "subTypeId": 0,
    //                             "outCome": "None",
    //                             "specialValue": "*",
    //                             "coefficient": "2.66"
    //                             }
    //                         ]
    //                         }
    //                     }
    //                     }

    //             );
    //    expect(data.message).to.equal(undefined);
    // })

    // it("////////////////////bets make express 2////////////////////", async () => {
    //     const { data } = await  socket.send("BETS:bets-make",
    //                     {
    //                     "currency": "RUB",
    //                     "betsMap": {
    //                         "prematch_14701041_409_0_Yes_*?prematch_14701055_290_0_None_*": {
    //                         "amount": 1,
    //                         "couponList": [
    //                             {
    //                             "service": "prematch",
    //                             "matchId": 14701041,
    //                             "typeId": 409,
    //                             "subTypeId": 0,
    //                             "outCome": "Yes",
    //                             "specialValue": "*",
    //                             "coefficient": "4.01"
    //                             },
    //                             {
    //                             "service": "prematch",
    //                             "matchId": 14701055,
    //                             "typeId": 290,
    //                             "subTypeId": 0,
    //                             "outCome": "None",
    //                             "specialValue": "*",
    //                             "coefficient": "7.72"
    //                             }
    //                         ]
    //                         }
    //                     }
    //                     }
    //             );

    //    expect(data.message).to.equal(undefined);
    // })
*/

})
