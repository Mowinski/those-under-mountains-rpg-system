import { skillDices } from "./consts.mjs";

export class SystemActor extends Actor {
	prepareData() {
		// Prepare data for the actor. Calling the super version of this executes
		// the following, in order: data reset (to clear active effects),
		// prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
		// prepareDerivedData().
		super.prepareData();
	}

	/** @override */
	prepareBaseData() {
		// Data modifications in this step occur before processing embedded
		// documents or derived data.
	}

	/**
	 * @override
	 * Augment the actor source data with additional dynamic data. Typically,
	 * you'll want to handle most of your calculated/derived data in this step.
	 * Data calculated in this step should generally not exist in template.json
	 * (such as ability modifiers rather than ability scores) and should be
	 * available both inside and outside of character sheets (such as if an actor
	 * is queried and has a roll executed directly from it).
	 */
	prepareDerivedData() {
		super.prepareDerivedData();
		const actorData = this;

		// Make separate methods for each Actor type (character, npc, etc.) to keep
		// things organized.
		if (actorData.type === "dwarf") {
			this._prepareDwarfData(actorData);
		}
	}

	/**
	 * Prepare Character type specific data
	 */
	_prepareDwarfData(actorData) {}

	async applyDamage() {
		damage = 1;

		const { value } = this.system.resources.wounds;
		await this.update({ "system.resources.wounds.value": value + damage });

		await ChatMessage.implementation.create({
			content: `${this.name} took damage!`,
		});
	}
}

export class SystemItem extends Item {
	prepareDerivedData() {
		super.prepareDerivedData();
		this.level = Math.max(0, Math.floor(Math.log2(this.system.exp + 1)) - 1);
		this.nextLevel = Math.pow(2, this.level + 2) - 1;

		this.dice = skillDices[this.level] || "d4";
	}

	async roll(actor) {
		let roll = new Roll(this.dice, this);
		let label = this.name ? game.i18n.format("sheet.rollDice", { label: this.name }) : "";
		roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: actor }),
			flavor: label,
		});
	}
}
