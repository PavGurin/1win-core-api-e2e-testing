const [NOT_STATUS, TYPE_SUCCESS, TYPE_ERROR, TYPE_ERROR_INFO] = [
  'not',
  'success',
  'error',
  'error-info',
];

export default class Coupon {
  constructor(data = {}) {
    const {
      service = '',
      matchId = '',
      typeId = '',
      subTypeId = '',
      outCome = '',
      specialValue = '',
      oddsType = null,
      odd = null,
      match = null,
      coefficient = null,
    } = data;

    // request data
    this.couponId = Coupon.genId({
      service,
      matchId,
      typeId,
      subTypeId,
      outCome,
      specialValue,
    });
    this.service = service;
    this.matchId = matchId;
    this.typeId = typeId;
    this.subTypeId = subTypeId;
    this.outCome = outCome;
    this.specialValue = specialValue;
    this.oddsType = oddsType;
    this.odd = odd;
    this.match = match;
    this.saveCoefficient = +coefficient;

    // old
    this.maxBetAmount = 0;
    this.sum = 100;
    this.marketName = '';
    this.status = NOT_STATUS;
    this.dataResponse = {};
    this.maxBetAmountLoading = true;
  }

  static genId({
    service = '',
    matchId = '',
    typeId = '',
    subTypeId = '',
    outCome = '',
    specialValue = '',
  }) {
    return `${service}_${matchId}_${typeId}_${subTypeId}_${outCome}_${specialValue}`;
  }
}
