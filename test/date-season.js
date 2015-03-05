var test = require('tape')
var seasonResolver = require('..')



test('happiness', function(t) {
  t.plan(1)
  t.equals(true, true, ':)')
})



test('astro - defaults work as expected', function(t) {
  t.plan(3)
  var date = getDate(2015, 09, 28)
  t.equals(seasonResolver()(date), 'Fall')
  t.equals(seasonResolver({ north: true })(date), 'Fall')
  t.equals(seasonResolver('astronomical')(date), 'Fall')
})



test('astro - can configure autumn output', function(t) {
  t.plan(1)
  var date = getDate(2015, 09, 28)
  t.equals(seasonResolver({ autumn: true })(date), 'Autumn')
})



test('astro - can resolve from string', function(t) {
  t.plan(1)
  t.equals(seasonResolver()('2015-09-24'), 'Fall')
})



test('astro - can get all seasons', function(t) {
  t.plan(8)
  var spring = getDate(2015, 04, 01)
  var summer = getDate(2015, 07, 31)
  var fall = getDate(2015, 09, 25)
  var winter = getDate(2015, 12, 25)

  var seasonNorth = seasonResolver()
  t.equals(seasonNorth(spring), 'Spring')
  t.equals(seasonNorth(summer), 'Summer')
  t.equals(seasonNorth(fall), 'Fall')
  t.equals(seasonNorth(winter), 'Winter')

  var seasonSouth = seasonResolver({ north: false })
  t.equals(seasonSouth(spring), 'Fall')
  t.equals(seasonSouth(summer), 'Winter')
  t.equals(seasonSouth(fall), 'Spring')
  t.equals(seasonSouth(winter), 'Summer')
})



test('astro - handles edges correctly', function(t) {
  t.plan(10)
  var season = seasonResolver()
  t.equals(season('2015-01-01 00:00 UTC'), 'Winter')
  t.equals(season('2015-03-20 21:00 UTC'), 'Winter')
  t.equals(season('2015-03-20 23:00 UTC'), 'Spring')
  t.equals(season('2015-06-21 15:00 UTC'), 'Spring')
  t.equals(season('2015-06-21 17:00 UTC'), 'Summer')
  t.equals(season('2015-09-23 07:00 UTC'), 'Summer')
  t.equals(season('2015-09-23 09:00 UTC'), 'Fall')
  t.equals(season('2015-12-22 03:00 UTC'), 'Fall')
  t.equals(season('2015-12-22 05:00 UTC'), 'Winter')
  t.equals(season('2015-12-31 23:59 UTC'), 'Winter')
})



function getDate(year, month, day) {
  return new Date(year, month - 1, day)
}



function getDateObj(date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate()
  }
}
