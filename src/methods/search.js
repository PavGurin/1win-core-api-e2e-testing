export async function search(lang, searchString, service) {
  return socket.send('EVENTS-SEARCH:events-search', {
    language: lang,
    search: searchString,
    service: service, // eslint-disable-line object-shorthand
  });
}
