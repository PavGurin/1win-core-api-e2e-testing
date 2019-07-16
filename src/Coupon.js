export default class Coupon {
  constructor(data = {}) {
    const {
      service = '',
      matchId = '',
      typeId = '',
      subTypeId = '',
      outCome = '',
      specialValue = '',
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
    this.coefficient = +coefficient;
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
