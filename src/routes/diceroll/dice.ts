// dice.js
import { from, interval, map, take, scan, startWith } from 'rxjs';

export function rollDice(sides = 6) {
	return from(interval(100).pipe(take(10))) // Simulate rolling for 10 iterations
		.pipe(
			map(() => Math.floor(Math.random() * sides) + 1),
			scan((acc, val) => val, 1), // Use scan to get the final result
			startWith(1)
		);
}
