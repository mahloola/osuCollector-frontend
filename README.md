# osuCollector

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## TODO


- not all beatmaps are rendering in /collections/:id route, probably a lot of missing maps from the storage cache maybe see whats up with that

### `Login Sessions`

- capture the auth token in the redirect URL, maybe storing that on the user's profile? i don't know how it's done. possibly make a GET route for that
- send /api/v2/users/me request with the token in the request header. get the username and display it on the top right along with the avatar. make that a dropdown menu with Settings, My Collections, Logout, etc.
- implement logging out somehow idk how to do that lol
- implement refresh token

### `Upload Route`
- this route already kinda exists, but the uploader is hardcoded to FunOrange, so this should be fixed when login sessions are a thing
- render all the collections of the user and checkboxes to allow the user to CHOOSE WHICH ONES THEY WANT TO UPLOAD

### `Pagination`

- fix API routes to use query parameters rather than path parameters
- implement pagination using 'startFrom' and 'count' query parameters

### `Collection ID`
- idk if IDs like '60b9a194c579296e10e40d45' are sustainable so possibly add an actual ID to the collection schema and start storing that
- DO THIS BEFORE LAUNCH !!!
- it would be cool for users to easily determine collection statistics through a simplified ID, e.g. what was the first uploaded collection ever

### `Bugs`

### `Design`
- get a cool background image/gif for the webpage I kinda want something dark and relaxing with a repeating pattern. possibly ask david to make something
- remake navbar to not be the basic bootstrap one cuz it sucks. make it fatter, different color, and bigger text. change font too
- redesign /collections/:id to fit the example design on the diagram page thing funorange made
- make collections redirect to beatmaps

## Features

### `Recent`
- render all collections that exist on the database, reverse sorted by date
- clicking a collection redirects you to its information listing, including all of its beatmaps with their data

### `Collection Details`
- collection information is displayed on /collections/:id where id is the "\_id" property of the collection. e.g. 60b9a194c579296e10e40d45
