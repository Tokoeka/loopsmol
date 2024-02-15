import { $class, $classes, $item, $path, ascend, prepareAscension } from "libram";

/* const timespinnerTargets = [
	"Busta_Rhymes",
	"Manendra",
	"Gausie",
	"Beldur",
	"worthawholebean",
	"ReverKiller",
	"phreddrickv2",
	"The Dictator",
]; */

/*while ($skill`Experience Safari`.timescast < get("skillLevel180") && safariTargets.length) {
		useSkill($skill`Experience Safari`, 1, safariTargets[0]);
		safariTargets.shift();
}*/

export function main(args = ""): void {
	const newClass = args.includes(`sc`)
		? $class`Seal Clubber`
		: args.includes(`tt`)
			? $class`Turtle Tamer`
			: args.includes(`sr`)
				? $class`Sauceror`
				: args.includes(`db`)
					? $class`Disco Bandit`
					: args.includes(`at`)
						? $class`Accordion Thief`
						: $class`Pastamancer`;

	prepareAscension({
		garden: "packet of thanksgarden seeds",
		eudora: "GameInformPowerDailyPro subscription card", // TBC
		chateau: {
			desk: `continental juice bar`,
			nightstand: $classes`Seal Clubber, Turtle Tamer`.includes(newClass)
				? `electric muscle stimulator`
				: $classes`Disco Bandit, Accordion Thief`.includes(newClass)
					? `bowl of potpourri`
					: `foreign language tapes`,
			ceiling: `ceiling fan`,
		},
	});

	ascend({
		path: $path`Nuclear Autumn`,
		playerClass: newClass,
		lifestyle: 2,
		moon: "gnomish",
		consumable: $item`astral six-pack`,
		pet: $item`astral mask`,
	});
}
