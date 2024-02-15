import {
	adv1,
	buyUsingStorage,
	cliExecute,
	create,
	itemAmount,
	myClass,
	myMeat,
	myPrimestat,
	mySign,
	pullsRemaining,
	retrieveItem,
	runChoice,
	storageAmount,
	takeStorage,
	toSkill,
	toUrl,
	use,
	visitUrl,
} from "kolmafia";
import {
	$class,
	$effect,
	$effects,
	$item,
	$items,
	$location,
	$skill,
	$stat,
	ensureEffect,
	get,
	have,
	withProperty,
} from "libram";
import { Quest } from "../engine/task";
import { primestatId } from "./leveling";

// eslint-disable-next-line libram/verify-constants
const pullBuyList = $items`cuppa Voraci tea, cuppa Sobrie tea, meteoreo, Tea\, Earl Grey\, Hot, ice rice, snow crab, mouth-watering mayolus, splendid martini, tuxedo shirt, 1\,970 carat gold, meat engine, dope wheels`;
const pullList = $items`Pantsgiving, distention pill, synthetic dog hair pill, mime army shotglass, smooth velvet hat, smooth velvet pocket square, smooth velvet socks, smooth velvet hanky`;

const moonSign =
	myPrimestat() === $stat`Muscle`
		? "wombat"
		: myPrimestat() === $stat`Mysticality`
			? "blender"
			: "packrat";

const juiceBarBuffs =
	myClass() === $class`Seal Clubber`
		? $effects`Sealed Brain, Temporary Lycanthropy`
		: $class`Turtle Tamer`
			? $effects`Extreme Muscle Relaxation, Puissant Pressure`
			: $class`Pastamancer`
				? $effects`Comic Violence`
				: $class`Sauceror`
					? $effects`On the Shoulders of Giants, Mystically Oiled, Hood Ridin'`
					: $class`Disco Bandit`
						? $effects`Savage Beast Inside`
						: $effects`Fishy Fortification, Proficient Pressure`;

export const NAPulls: Quest = {
	name: "NAPulls",
	tasks: [
		{
			name: "Stock",
			after: [],
			completed: () =>
				pullBuyList.every((item) => storageAmount(item) > 0) || pullsRemaining() === 0,
			do: () =>
				withProperty("autoBuyPriceLimit", 123456, () => {
					pullBuyList.forEach((item) => buyUsingStorage(item));
				}),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Pull",
			after: [ "Stock" ],
			completed: () => pullsRemaining() === 0,
			do: (): void => {
				pullBuyList.forEach((item) => takeStorage(item, 1));
				pullList.forEach((item) => takeStorage(item, 1));
			},
			limit: { tries: 1 },
			freeaction: true,
		},
	],
};

export const NAShelter: Quest = {
	name: "NAShelter",
	tasks: [
		{
			name: "Cooling Tank",
			after: [],
			completed: () => get("falloutShelterCoolingTankUsed"),
			do: () => visitUrl("place.php?whichplace=falloutshelter&action=vault8"),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Spa",
			after: [ "Cooling Tank" ],
			completed: () => get("_falloutShelterSpaUsed"),
			do: () => visitUrl("place.php?whichplace=falloutshelter&action=vault3"),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Chrono Lab",
			after: [ "Spa" ],
			completed: () => get("falloutShelterChronoUsed"),
			do: () => visitUrl("place.php?whichplace=falloutshelter&action=vault5"),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Rad-Pro",
			after: [ "Chrono Lab" ],
			completed: () => have($effect`Rad-Pro Tected`),
			do: (): void => {
				retrieveItem(2, $item`Rad-Pro (1 oz.)`);
				use(2, $item`Rad-Pro (1 oz.)`);
			},
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Wrist-Boy",
			after: [ "Rad-Pro" ],
			completed: () => have($item`Wrist-Boy`),
			do: () => retrieveItem(1, $item`Wrist-Boy`),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			//TODO - add additional completed logic / split into 3 tasks
			name: "Holorecords",
			after: [ "Wrist-Boy" ],
			completed: () =>
				$items`Superdrifter holo-record, Drunk Uncles holo-record, The Pigs holo-record`.every(
					(item) => have(item)
				),
			do: () =>
				$items`Superdrifter holo-record, Drunk Uncles holo-record, The Pigs holo-record`.forEach(
					(item) => retrieveItem(1, item)
				),
			limit: { tries: 1 },
			freeaction: true,
		},
	],
};

export const NASkills: Quest = {
	name: "NASkills",
	tasks: [
		{
			name: "Gall Bladder",
			after: [],
			completed: () => have($skill`Extra Gall Bladder`),
			do: () =>
				visitUrl("shop.php?whichshop=mutate&action=buyitem&quantity=1&pwd=&whichrow=877"),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Kidney",
			after: [ "Gall Bladder" ],
			completed: () => have($skill`Extra Kidney`),
			do: () =>
				visitUrl("shop.php?whichshop=mutate&action=buyitem&quantity=1&pwd=&whichrow=878"),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Mainstat",
			after: [ "Kidney" ],
			completed: () => have(toSkill(22020 + primestatId())),
			do: () =>
				visitUrl(
					`shop.php?whichshop=mutate&action=buyitem&quantity=1&pwd=&whichrow=86${primestatId()}`
				),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Mainstat Buff",
			after: [ "Muscles" ],
			completed: () => have(toSkill(22028 + primestatId())),
			do: () =>
				visitUrl(
					`shop.php?whichshop=mutate&action=buyitem&quantity=1&pwd=&whichrow=8${68 + primestatId()
					}`
				),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Soda Machine",
			after: [ "Mainstat Buff" ],
			completed: () => have($skill`Internal Soda Machine`),
			do: () =>
				visitUrl("shop.php?whichshop=mutate&action=buyitem&quantity=1&pwd=&whichrow=879"),
			limit: { tries: 1 },
			freeaction: true,
		},
	],
};

export const NAPrep: Quest = {
	name: "NAPrep",
	tasks: [
		{
			name: "NEP",
			after: [],
			completed: () => get("_questPartyFair") !== "unstarted",
			do: (): void => {
				visitUrl(toUrl($location`The Neverending Party`));
				if ([ "food", "booze" ].includes(get("_questPartyFairQuest")))
				{
					runChoice(1); // Accept quest
				} else
				{
					runChoice(2); // Decline quest
				}
			},
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Six Pack",
			after: [ "NEP" ],
			completed: () => !have($item`astral six-pack`),
			do: () => use(1, $item`astral six-pack`),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Beach",
			after: [ "Six Pack" ],
			completed: () => have($item`bitchin' meatcar`),
			do: () => create(1, $item`bitchin' meatcar`),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Getaway Buffs",
			after: [ "Beach" ],
			completed: () => get("_campAwaySmileBuffs") > 0,
			do: () => visitUrl("place.php?whichplace=campaway&action=campaway_sky"),
			limit: { tries: 2 },
			freeaction: true,
		},
		{
			name: "Cowboy Boots",
			after: [ "Getaway Buffs" ],
			completed: () => have($item`your cowboy boots`),
			do: () => visitUrl("place.php?whichplace=town_right&action=townright_ltt"),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Fireworks Hat",
			after: [ "Cowboy Boots" ],
			completed: () => get("_fireworksShopHatBought"),
			do: (): void => {
				visitUrl("clan_viplounge.php");
				visitUrl("clan_viplounge.php?action=fwshop&whichfloor=2");
				visitUrl("shop.php?whichshop=fwshop&action=buyitem&quantity=1&whichrow=1247&pwd");
			},
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "GamePro Dungeon",
			after: [ "Fireworks Hat" ],
			completed: () => have($item`scroll of Puddingskin`),
			do: (): void => {
				visitUrl("inv_use.php?whichitem=6174&confirm=Yep.&pwd=");
				visitUrl("main.php");
				cliExecute("refresh inv");
				adv1($location`Video Game Level 1`);
				use(1, $item`dungeoneering kit`);
			},
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Chateau Desk",
			after: [ "GamePro Dungeon" ],
			completed: () => get("_chateauDeskHarvested"),
			do: () => visitUrl("place.php?whichplace=chateau&action=chateau_desk2"),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Chateau Potions",
			after: [ "Chateau Desk" ],
			completed: () => juiceBarBuffs.every(have),
			do: () => juiceBarBuffs.forEach((effect) => ensureEffect(effect)),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Horsery",
			after: [ "Chateau Potions" ],
			completed: () => get("_horsery") === "crazy horse",
			do: () => cliExecute("horsery crazy"),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Shower",
			after: [ "Horsery" ],
			completed: () => get("_aprilShower"),
			do: () =>
				cliExecute(
					`shower ${myPrimestat() === $stat`Muscle`
						? "warm"
						: myPrimestat() === $stat`Mysticality`
							? "lukewarm"
							: "cool"
					}`
				),
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Camera",
			after: [ "Shower" ],
			completed: () => get("backupCameraMode") === "ml" && get("backupCameraReverserEnabled"),
			do: (): void => {
				cliExecute("backupcamera ml");
				cliExecute("backupcamera reverser on");
			},
			limit: { tries: 1 },
			freeaction: true,
		},
		{
			name: "Discover Torso",
			after: [ "Camera" ],
			ready: () => itemAmount($item`bitchin' meatcar`) > 0 && myMeat() > 5000,
			completed: () => have($skill`Torso Awareness`),
			do: (): void => {
				if (mySign() !== moonSign)
				{
					throw "wrong sign";
					//TODO add in moon tuneing
				}
				visitUrl("gnomes.php?place=skills");
				visitUrl("gnomes.php?action=trainskill&pwd&whichskill=12");
			},
			limit: { tries: 1 },
			freeaction: true,
		},
	],
};
