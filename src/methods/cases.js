export const cases = {
  async getCaseInfo(socket, caseId) {
    return socket.send(`CASES:cases-${caseId}`, {
    });
  },
  async getCaseCost(socket, caseId) {
    const { data: { cost: caseCost } } = await socket.send(`CASES:cases-${caseId}`, {
    });
    return caseCost;
  },
  async playCaseWithoutChance(socket, caseId) {
    return socket.send('CASES:cases-play', {
      id: caseId,
      chance: null,
      host: defaultVisitDomain,
    });
  },
  async raitingCase(socket) {
    return socket.send('CASES:cases-rating', {});
  },
  async playCaseWithChance(socket, caseId, chance) {
    return socket.send('CASES:cases-play', {
      id: caseId,
      chance,
      host: defaultVisitDomain,
    });
  },
  async getCaseInfoByTypeId(socket, caseTypeId) {
    return socket.send('CASES:cases-casesByTypeId', { caseTypeId });
  },
};
