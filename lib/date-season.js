'use strict'

var moonbeams = require('moonbeams')

var ASTRO = 'astronomical'
var DEFAULT = ASTRO

// Default options for each season system

var defaults = {}

defaults[ASTRO] = {
  north: true,
  autumn: false
}

// Resolver functions for each season system

var resolvers = {}

/**
 * Resolves a season string for the given date using equinox
 * based seasons (Western system).
 *
 * @param {Date} date Date for which to resolve season
 * @param {object} options
 * @return {string} Name of season
 */
resolvers[ASTRO] = function resolverAstronomical (date, options) {
  if (!date) return
  options = options || {}
  var dateObj = getDateObj(date)
  var north = typeof options.north === 'undefined' ?
      true : options.north
  var fall = options.autumn ? 'Autumn' : 'Fall'

  // Calculate given date in Julian days
  var julianDayFraction = moonbeams.hmsToDay(
      dateObj.hours, dateObj.minutes, dateObj.seconds)
  var jd = moonbeams.calendarToJd(
    dateObj.year, dateObj.month, dateObj.day + julianDayFraction)
  var equinoxes = []
  // TODO Could LRU cache Julian equinoxes for each year
  // Calculate Julian days of equinoxes for given year
  ;[0, 1, 2, 3].forEach(function (index) {
    equinoxes.push(moonbeams.season(index, dateObj.year))
  })
  if (jd >= equinoxes[0] && jd < equinoxes[1]) {
    return north ? 'Spring' : fall
  } else if (jd >= equinoxes[1] && jd < equinoxes[2]) {
    return north ? 'Summer' : 'Winter'
  } else if (jd >= equinoxes[2] && jd < equinoxes[3]) {
    return north ? fall : 'Spring'
  } else if (jd >= equinoxes[3] || jd < equinoxes[0]) {
    return north ? 'Winter' : 'Summer'
  }
}

/**
 * Parse options and dispatch to needed resolver
 */
module.exports = function createResolver (type, options) {
  // If only one argument is supplied
  if (type && !options) {
    // Determine whether it was the options or the
    // resolver.
    if (typeof type === 'object') {
      options = type
      type = DEFAULT
    } else {
      options = defaults[type]
    }
  } else {
    type = type || DEFAULT
    options = options || defaults[type]
  }

  return dateGuard(partialRight(resolvers[type], options))
}

/**
 * Assure `Date` type. Coerces string types.
 */
function dateGuard (fn) {
  return function (date) {
    var parsed
    if (typeof date === 'string') {
      parsed = parseDate(date)
    } else if (date instanceof Date) {
      parsed = date
    } else {
      parsed = null
    }
    return fn(parsed)
  }
}

/**
 * Partially apply arguments to function from right to left
 */
function partialRight (fn /*, args... */) {
  var partialArgs = Array.prototype.slice.call(arguments, 1)
  return function () {
    var args = Array.prototype.slice.call(arguments)
    return fn.apply(this, args.concat(partialArgs))
  }
}

/**
 * Takes a Date and returns a {year, month, day, hours, minutes, seconds}
 */
function getDateObj (date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds()
  }
}

/**
 * Simple date string parsing
 */
function parseDate (dateStr) {
  return new Date(dateStr)
}
