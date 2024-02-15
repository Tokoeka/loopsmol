import { haveEquipped, Location, Monster } from "kolmafia";
import { $item, Macro } from "libram";
import { ActionDefaults, CombatStrategy as BaseCombatStrategy } from "grimoire-kolmafia";

const myActions = [
  "ignore", // Task doesn't care what happens
  "ignoreSoftBanish", // Do not seek out a banish, but it is advantageous to have it
  "ignoreNoBanish", // Task doesn't care what happens, as long as it is not banished
  "kill", // Task needs to kill it, with or without a free kill
  "killFree", // Task needs to kill it with a free kill
  "killHard", // Task needs to kill it without using a free kill (i.e., boss, or already free)
  "banish", // Task doesn't care what happens, but banishing is useful
  "abort", // Abort the macro and the script; an error has occured
  "killItem", // Kill with an item boost,
  "yellowRay", // Kill with a drop-everything YR action
  "forceItems", // Force items to drop with a YR or saber
] as const;
export type CombatActions = (typeof myActions)[ number ];
export class CombatStrategy extends BaseCombatStrategy.withActions(myActions) { }
export class MyActionDefaults implements ActionDefaults<CombatActions> {
  ignore(target?: Monster | Location) {
    return this.kill(target);
  }

  ignoreSoftBanish(target?: Monster | Location) {
    return this.kill(target);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  kill(target?: Monster | Location) {
    return killMacro();
  }

  killHard(target?: Monster | Location) {
    return this.kill(target);
  }

  ignoreNoBanish(target?: Monster | Location) {
    return this.kill(target);
  }

  killFree() {
    return this.abort();
  } // Abort if no resource provided

  banish(target?: Monster | Location) {
    return this.kill(target);
  }

  abort() {
    return new Macro().abort();
  }

  killItem(target?: Monster | Location) {
    return this.kill(target);
  }

  yellowRay(target?: Monster | Location) {
    return this.killItem(target);
  }

  forceItems(target?: Monster | Location) {
    return this.killItem(target);
  }
}

export function killMacro(): Macro {
  if (haveEquipped($item`June cleaver`))
  {
    return new Macro().attack().repeat();
  }
  return new Macro()
    .attack()
    .repeat();
}
