const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const Boom = require('boom');
const Req = require('cheerio-req')

// Jersey shore
//const url = 'http://events.gotsport.com/events/schedule.aspx?eventid=63230'

// EDP Spring
// const url = 'http://events.gotsport.com/events/schedule.aspx?eventid=64066'

const baseUrl = 'http://events.gotsport.com/events/schedule.aspx?eventid=';

async function getSchedule(eventId) {
  return new Promise((resolve, reject) => {
    Req(`${baseUrl}${eventId}`, (err, $) => {
      if (err) {
        return reject(Boom.badImplementation('Error fetching schedule', err));
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
      return resolve(games);
    })
  });
};

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'dist')
    }
  }
});

server.route({
    method: 'GET',
    path: '/schedule/{eventId}',
    handler: (request, h) => {
      return getSchedule(request.params.eventId);
    }
});

const init = async () => {
  await server.register(Inert);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.file('index.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        index: true
      }
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();