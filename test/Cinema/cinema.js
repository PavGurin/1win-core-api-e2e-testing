import { cinema } from '../../src/methods/cinema';
import { checkSuccess } from '../../src/responseChecker';
import { register } from '../../src/methods/register';

describe('Films', () => {
  it('C1789817 - connection 1Win-Films default', async () => {
    const response = await cinema.filmsAll(0, 20);
    checkSuccess(response);
  });
  it('C1914713 - connection 1Win-Films with limit = 5', async () => {
    const response = await cinema.filmsAll(0, 5);
    checkSuccess(response);
  });
  it('C1914714 - connection 1Win-Films with limit =100', async () => {
    const response = await cinema.filmsAll(0, 100);
    checkSuccess(response);
  });
  it('C1914715 - connection 1Win-Films with offset = 10', async () => {
    const response = await cinema.filmsAll();
    checkSuccess(response);
  });
  it('C1914716 - connection 1Win-Films with offset = 10 and limit= 50', async () => {
    const response = await cinema.filmsAll();
    checkSuccess(response);
  });
  it('C1789818 -  Slider Films', async () => {
    const response = await cinema.SliderFilms();
    checkSuccess(response);
  });
  it('C1789819 - Slider Films have films', async () => {
    const { data: { films } } = await cinema.SliderFilms();
    expect(films.length).toBeGreaterThan(0);
  });
  it('C1789820 - Search Films to name', async () => {
    const { data: { films: { 0: { name } } } } = await cinema.SearchFilms('Титаник');
    // console.log(films);
    expect(name).toContain('Титаник');
  });
  it('C1916738 - Search Films to long name', async () => {
    const { data: { films } } = await cinema.SearchFilms('Прошло десять лет с тех пор, как Джон Коннор помог предотвратить Судный День и спасти человечество от массового уничтожения. Теперь ему 25, Коннор не живет «как все» - у него нет дома, нет кредитных карт, нет сотового телефона и никакой работы. Его существование нигде не зарегистрировано. Он не может быть прослежен системой Skynet - высокоразвитой сетью машин, которые когда-то попробовали убить его и развязать войну против человечества. Пока из теней будущего не появляется T-X - Терминатрикс, самый сложный киборг-убийца Skynet. Посланная назад сквозь время, чтобы завершить работу, начатую её предшественником, T-1000, эта машина так же упорна, как прекрасен её человеческий облик. Теперь единственная надежда Коннору выжить - Терминатор, его таинственный прежний убийца. Вместе они должны одержать победу над новыми технологиями T-X и снова предотвратить Судный День...');
    // console.log(films);
    expect(films).toBeDefined();
  });

  it('C1789821 - Search Films without name', async () => {
    const { data: { films } } = await cinema.SearchFilms('');
    expect(films.length).toBeGreaterThan(0);
  });
  it('C1789822 - Search Films with Unreal name', async () => {
    const { data: { films } } = await cinema.SearchFilms('нет такго фильма');
    expect(films).toHaveLength(0);
  });
  it('C1789823 - Search Films to foreign name', async () => {
    const { data: { films: { 0: { name_foreign } } } } = await cinema.SearchFilms('Legend');
    // console.log(name_foreign);
    expect(name_foreign).toContain('Legend');
  });
  it('C1789824 - Open random film', async () => {
    const response = await cinema.OpenFilms();
    checkSuccess(response);
    const { data: { name } } = await cinema.OpenFilms();
    expect(name).toBeDefined();
  });
  it('C1789825 - Filter to genre', async () => {
    const { data: { films: { 2: { genre } } } } = await cinema.FilterFilmsForGenre(['ужасы']);
    expect(genre).toContain('ужасы');
  });

  it('C1789826 - Filter to some genre', async () => {
    const { data: { films } } = await cinema.FilterFilmsForGenre(['боевик', 'драма', 'приключения']);
    // console.log(films);
    films.forEach((film) => { expect(['боевик', 'драма', 'приключения'].some(substring => film.genre.includes(substring))).toEqual(true); });
  });
  it('C1789827 - Filter for UnRealGenre', async () => {
    const { data: { films } } = await cinema.FilterFilmsForGenre(['Жанр, которого нет']);
    expect(films).toHaveLength(0);
  });
  it('C1789828 - Filter for ratingImbd', async () => {
    const { data: { films } } = await cinema.FilterFilmsForRatingIMDb(7, 10);
    films.forEach((film) => { expect(film.imdb).toBeGreaterThan(7); });
  });
  it('C1789829 - Filter for ratingImbd<0', async () => {
    const { data: { films } } = await cinema.FilterFilmsForRatingIMDb(-10, -1);
    expect(films).toEqual(undefined);
  });
  it('C1789830 - Filter for ratingImbd>10', async () => {
    const { data: { films } } = await cinema.FilterFilmsForRatingIMDb(11, 15);
    expect(films).toEqual(undefined);
  });

  it('C1789831 - Filter with NegativeRatingImbd', async () => {
    const { data: { films } } = await cinema.FilterFilmsForRatingIMDb(8, 4);
    expect(films).toHaveLength(0);
  });

  it('C1916739 - Filter with RatingImbdWhereRatingNotANum', async () => {
    const { data: { films } } = await cinema.FilterFilmsForRatingIMDb('Бла бла бла', 4);
    // console.log(films)
    expect(films).toEqual(undefined);
  });
  it('C1789832 - Filter with ratingKinopoisk', async () => {
    const { data: { films } } = await cinema.FilterFilmsForRatingKinopoisk(5, 8);
    films.forEach((film) => { expect(film.rating).toBeGreaterThan(5); });
    films.forEach((film) => { expect(film.rating).toBeLessThan(8); });
  });
  it('C1789833 - Filter for NegativeRatingKinopoisk', async () => {
    const { data: { films } } = await cinema.FilterFilmsForRatingKinopoisk(8, 4);
    expect(films).toHaveLength(0);
  });

  it('C1789834 - Filter to date', async () => {
    const { data: { films } } = await cinema.FilterToDate('2012-01-01', '2015-12-31');
    films.forEach((film) => {
      if (Number(film.year) < 2012) {
        // console.log(film);
      }expect(Number(film.year)).toBeGreaterThanOrEqual(2012);
    });
  });

  it('C1789835 - Filter to dateNegative', async () => {
    const { data: { films } } = await cinema.FilterToDate('2015-01-01', '2012-12-31');
    // console.log(films);
    expect(films).toHaveLength(0);
  });
  it('C1916740 - Filter to dateNegativeWithLetters', async () => {
    const { data: { films } } = await cinema.FilterToDate('2015 абвгд', '2012-12-31');
    // console.log(films);
    expect(films).toHaveLength(0);
  });
  it('C1916741 - Filter to dateWhereDateIsNum', async () => {
    const { data: { films } } = await cinema.FilterToDate(2018, 2019);
    // console.log(films);
    expect(films).toEqual(undefined);
  });
  it('C1916742 - Filter to dateWhereWrongFormat', async () => {
    const { data: { films } } = await cinema.FilterToDate('2019/01/27', '2019/01/29');
    // console.log(films);
    expect(films).toHaveLength(0);
  });
  it('C1914717 - Filter to some parameters', async () => {
    const { data: { films } } = await cinema.FilterForSomeParameters(0, 20, '2015-01-01', '2019-12-31', 6.5, 9, ['Комедия']);
    // console.log(films);
    expect(films.length).toBeGreaterThan(0);
  });

  it('C1789836 - Films Soon', async () => {
    const { data: { films } } = await cinema.FilmsSoon();
    // console.log(films);
    expect(films.length).toBeGreaterThan(0);
  });
  it('C1916743 - Rega + cinema', async () => {
    const { data } = await register.oneClickReg();
    // console.log(data);
    const response = await cinema.filmsAll(0, 20);
    checkSuccess(response);
  });
});
