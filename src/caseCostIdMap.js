export const caseCostIdMap = {
  RUB: [
    { id: 1, cost: 50 },
    { id: 2, cost: 20 },
    { id: 3, cost: 100 },
    { id: 4, cost: 500 },
    { id: 5, cost: 10 },
    { id: 6, cost: 1000 },
    { id: 7, cost: 5000 },
    { id: 8, cost: 10000 },
  ],
  USD: [
    { id: 10, cost: 1 },
    { id: 11, cost: 0.4 },
    { id: 12, cost: 2 },
    { id: 13, cost: 10 },
    { id: 14, cost: 0.2 },
    { id: 15, cost: 20 },
    { id: 16, cost: 100 },
    { id: 17, cost: 200 },
  ],
  EUR: [
    { id: 18, cost: 1 },
    { id: 19, cost: 0.4 },
    { id: 20, cost: 2 },
    { id: 21, cost: 10 },
    { id: 22, cost: 0.2 },
    { id: 23, cost: 20 },
    { id: 24, cost: 100 },
    { id: 25, cost: 200 },
  ],
  UAH: [
    { id: 26, cost: 25 },
    { id: 27, cost: 10 },
    { id: 28, cost: 50 },
    { id: 29, cost: 250 },
    { id: 30, cost: 5 },
    { id: 31, cost: 500 },
    { id: 32, cost: 2500 },
    { id: 33, cost: 5000 },
  ],
};

export function caseIdByCost(currency, cost) {
  return caseCostIdMap[currency].find(item => item.cost === cost).id;
}
