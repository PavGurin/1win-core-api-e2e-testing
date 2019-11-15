export const cases = {
  async getCaseInfo(caseId) {
    return socket.send(`CASES:cases-${caseId}`, {
    });
  },
  async getCaseCost(caseId) {
    const { data: { cost: caseCost } } = await socket.send(`CASES:cases-${caseId}`, {
    });
    return caseCost;
  },
  async playCaseWithoutChance(caseId) {
    return socket.send('CASES:cases-play', {
      id: caseId,
      chance: null,
      host: defaultVisitDomain,
    });
  },
  async raitingCase() {
    return socket.send('CASES:cases-rating', {});
  },
  async playCaseWithChance(caseId, chance) {
    return socket.send('CASES:cases-play', {
      id: caseId,
      chance,
      host: defaultVisitDomain,
    });
  },
  async getCaseInfoByTypeId(caseTypeId) {
    return socket.send('CASES:cases-casesByTypeId', { caseTypeId });
  },
};
