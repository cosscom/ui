# The Booker calls the Cal API from the browser

The Booker atom fetches event types and slots and creates bookings directly from the visitor's browser, with plain `fetch` behind one `BookerClient` interface, and ships no API key handling and no server code. We chose this because every endpoint in the booking flow accepts anonymous requests and the API allows any origin, so there is no secret to protect; the atom then installs with no setup in any React framework, and each visitor is rate-limited on their own instead of all of a site's visitors sharing the server's budget.

## Considered options

- **Server actions with a mandatory API key**, as the first version of the Booker did. Rejected: it ties the atom to Next.js, requires environment setup before anything renders, and puts every visitor on one shared rate limit.
- **A route handler the integrator adds as a proxy.** Rejected as the default for the same setup cost. It remains possible for an integrator who wants a key, by supplying their own `BookerClient`.

## Consequences

- The atom may only use endpoints that work anonymously. Anything that needs authentication, such as fetching an event type by id or the calendar-links endpoint, is unavailable to it.
- The Cal API version header is sent from the client on every request, so a version change is a change to the installed code, not to a server setting.
