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
  async playCase(caseId) {
    return socket.send('CASES:cases-play', {
      id: caseId,
      chance: null,
      host: defaultVisitDomain,
    });
  },
};
