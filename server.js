const req = require('cheerio-req')

// Jersey shore
const url = 'http://events.gotsport.com/events/schedule.aspx?eventid=63230'

// EDP Spring
// const url = 'http://events.gotsport.com/events/schedule.aspx?eventid=64066'

req(url, (err, $) => {
  if (err) {
    console.error('Error fetching data', err);
    return
  }

  let currentDay
  let games = []
  $('div.SubHeading').parent().find('tr').each((i, e) => {
    const day = $(e).has('.PageHeading')
    // console.info(day.text().trim());
    if (day.length) {
      currentDay = day.text().trim()
      return;
    }
    if ($(e).is('tr[bgcolor]')) {
      const data = $(e).children()
      games.push({
        day: currentDay,
        gameNumber: data.eq(0).text(),
        time: data.eq(1).text(),
        homeTeam: data.eq(2).children('a').first().text(),
        awayTeam: data.eq(4).children('a').first().text(),
        location: data.eq(6).children('a').first().text()
      })
    }
  })
  games = games.filter(game => {
    if (game.awayTeam.toLowerCase().includes('princeton fc') || game.homeTeam.toLowerCase().includes('princeton fc')) {
      return true;
    }
    return false;
  })
  console.info(games);
})