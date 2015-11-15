# Installation

`npm install -g swagger`

`npm install`

To have the server up and running on http://localhost:10010 run:

`swagger project start`

and, to present a UI to interact with the RESTful API, run in separate terminal:

`swagger project edit`

To run tests:

`npm test`

# Overview

This is a RESTful API with only one resource, `url`, intended to be interfaced only with trusted services(i.e. not consumer-facing). The `PATCH` method specifically, for purposes of being RESTful, allows services to decrement/increment the `url` resource's `visits` property as they wish. Thusly, if you are bit.ly, you could interface with this API within a private network and store visits using the API.

### Methods

#### POST /url

Accepts a url object in the form of `{ url: <string> }`. `id` and `visits` properties are ignored since they're overwritten during creation.

#### GET /url/{id}

`id` must be a base62 string. Returns 200 OK if url exists, 404 if not found, etc. Responds with a url object in the form of `{ id: <string>, url: <string>, visits: <int>}`

#### PATCH /url/{id}

Accepts an array of json patch document instructions, but only accepts `add` op instructions on the `/visits` path, where `value` can be any integer.
