date-season
===

Author: Sean Fridman

License: MIT

[![build status](https://secure.travis-ci.org/sfrdmn/node-date-season.png)](http://travis-ci.org/sfrdmn/node-date-season)

[![testling badge](https://ci.testling.com/sfrdmn/node-date-season.png)](https://ci.testling.com/sfrdmn/node-date-season)

[![js-standard-style](https://raw.githubusercontent.com/feross/standard/master/badge.png)](https://github.com/feross/standard)


Description
---

Takes a date and returns its season as a string. Currently supports only "Western" astronomical seasons


API
---

The resolver will return one of 'Spring', 'Summer', 'Fall', or 'Winter'
(and 'Autumn' instead of 'Fall' if configured)


Usage
---

```Javascript
// Returns a function which accepts configuration options for the
// desired resolver.
var createSeasonResolver = require('date-season')

// The season resolver will default to the Northern hemisphere
var seasonNorth = createSeasonResolver()
seasonNorth('2015-12-25') // 'Winter'
seasonNorth(new Date()) // whatever season it currently is in the Northern hemisphere

// We can configure the resolver with the following options
var seasonSouth = createSeasonResolver({ north: false, autumn: true })
seasonSouth('2015-12-25') // 'Summer'
```

Or a bit more idiomatic:

```Javascript
var season = require('date-season')()

season('2015-12-25') // 'Winter'
```

