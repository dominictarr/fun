# fun

functional system programming.

Recently, a functional style of programming
has become very popular in the front end.
react, cycle.js, choo-choo, etc.

At first, I was deeply skeptical, as a single
shared state object seemed to throw out the idea
of encapsulation. But then I started to find uses
for the idea of a shared state. Encapsulation is good,
but being explicit about state is also very good.

The pattern of separating effects from state is very
good for systems programming - because on of the hardest
things is dealing with all the possible permutations of event
orderings. If you can replay events, and generate events
in different orders, it's possible to get free test coverage
of possible race conditions.

## examples

## License

MIT

