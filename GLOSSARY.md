# coss ui

A registry of copy-paste React components installed with the shadcn CLI. This glossary fixes the words used for the kinds of thing the registry ships.

## Language

**Atom**:
A registry item that connects coss ui components to the Cal.com API, so it works against real scheduling data once installed.
_Avoid_: Cal atom, widget, block, embed

**Booker**:
The atom that lets someone pick a time and book a Cal.com event.
_Avoid_: Booking widget, scheduler, calendar embed

**Event type**:
What an attendee books: a kind of meeting a host offers on Cal.com, with its own title, duration, locations and rules.
_Avoid_: Event, target, meeting type, booking link

**Attendee**:
The person booking an event through the Booker.
_Avoid_: Booker (for the person), visitor, user, customer

**Guest**:
A person the attendee adds to their booking.
_Avoid_: Additional attendee, invitee

**Fallback**:
What the Booker shows in place of the booking flow when an event cannot be booked through it: a short message and a link to the event's own Cal.com booking page.
_Avoid_: Error state, unsupported screen

**Particle**:
A pre-assembled registry item that combines several primitives into a ready-to-use piece of interface, with no connection to an outside service.
_Avoid_: Block, pattern, atom
