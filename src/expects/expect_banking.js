import {expect} from 'chai';

export function succses_deposit_create(data, expectedCurrency, expectedUserId, expectedPaymentType, expectedAmount) {
    expect(data.apiResponse.error).equal(false);
    expect(data.currency).equal(expectedCurrency);
    expect(data.user_id).equal(expectedUserId);
    expect(data.paymentType).equal(expectedPaymentType);
    expect(data.amount).equal(expectedAmount);
};

export function succses_withdrawal_create(data) {
    expect(data).to.be.an('object');
    expect(data.email).not.equal(null);
    expect(data.message).equal(undefined);
}