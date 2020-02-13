export const cinema = {

  async filmsAll(offsetNum, LimitFilm) {
    return socket.send('1WIN-TV:films', {
      offset: offsetNum,
      limit: LimitFilm,
    });
  },
  async SliderFilms() {
    return socket.send('1WIN-TV:films-slider', {

    });
  },
  async SearchFilms(filmName) {
    return socket.send('1WIN-TV:films', {
      where: { title: filmName },
    });
  },
  async OpenFilms() {
    const numFilm = Math.ceil(Math.random() * 100);
    return socket.send(`1WIN-TV:films-${numFilm}`, {

    });
  },
  async FilterFilmsForGenre(genres) {
    return socket.send('1WIN-TV:films', {

      where: { genres },
    });
  },
  async FilterFilmsForRatingIMDb(min, max) {
    return socket.send('1WIN-TV:films', {

      where: { imdb_rating: { min, max } },
    });
  },
  async FilterFilmsForRatingKinopoisk(min, max) {
    return socket.send('1WIN-TV:films', {

      where: { rating: { min, max } },
    });
  },
  async FilterToDate(min, max) {
    return socket.send('1WIN-TV:films', {

      where: { date: { min, max } },
    });
  },
  async FilterForSomeParameters(offsetNum, LimitFilm, min, max, minRating, maxRating, genres) {
    return socket.send('1WIN-TV:films', {
      offset: offsetNum,
      limit: LimitFilm,
      where: { date: { min, max }, rating: { min: minRating, max: maxRating }, genres },

    });
  },
  async FilmsSoon() {
    return socket.send('1WIN-TV:films-soon', {
      offset: 0,
      limit: 20,
    });
  },
};
