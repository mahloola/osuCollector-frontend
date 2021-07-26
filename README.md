# osuCollector

## TODO

### `Environment Variables`
- start using environment variables. we should probably do this asap LOL
- things to store: OAuth details, osu API key (if we even need one)

### `Login Sessions`

- capture the auth token in the redirect URL, maybe storing that on the user's profile? i don't know how it's done. possibly make a GET route for that
- send /api/v2/users/me request with the token in the request header. get the username and display it on the top right along with the avatar. make that a dropdown menu with Settings, My Collections, Logout, etc.
- implement logging out somehow idk how to do that lol
- implement refresh token

### `Upload Route`
- this route already kinda exists, but the uploader is hardcoded to FunOrange, so this should be fixed when login sessions are a thing
- render all the collections of the user and checkboxes to allow the user to CHOOSE WHICH ONES THEY WANT TO UPLOAD

### `Adding Collections`
- the user will have a download option next to all collections, as well as a checkbox
- check if the user has an associated 'collections.db' file
- update their collections.db file to include all of the selected collections
- figure out how to store the user's collections.db: should it check for updates every time they log on? how should this work
- all together this is prob the hardest feature to implement but it's the main thing osuCollector has to offer so that would be insane

### `Pagination`

- fix API routes to use query parameters rather than path parameters
- implement pagination using 'startFrom' and 'count' query parameters

### `Searchbar`
- allow users to search for a collection via

### `Collection ID`
- idk if IDs like '60b9a194c579296e10e40d45' are sustainable so possibly add an actual ID to the collection schema and start storing that
- DO THIS BEFORE LAUNCH !!!
- it would be cool for users to easily determine collection statistics through a simplified ID, e.g. what was the first uploaded collection ever

### `Bugs`
- very few beatmaps are rendering in /collections/:id route, probably a lot of missing maps from the storage cache even tho we're supposed to have 'half of all osu maps' maybe see whats up with that

### `Design`
- get a cool background image/gif for the webpage I kinda want something dark and relaxing with a repeating pattern. possibly ask david to make something
- remake navbar to not be the basic bootstrap one cuz it sucks. make it fatter, different color, and bigger text. change font too
- redesign /collections/:id to fit the example design on the diagram page thing funorange made
- make collections redirect to beatmaps

### `Subscription`
- can be done at the very end of the project
- figure out how to handle transactions

### `User Tutorial`
- also do at the very end
- use the homepage to explain how osuCollector works in layman terms

## Features

### `Recent`
- render all collections that exist on the database, reverse sorted by date
- clicking a collection redirects you to its information listing, including all of its beatmaps with their data

### `Collection Details`
- collection information is displayed on /collections/:id where id is the "\_id" property of the collection. e.g. 60b9a194c579296e10e40d45
