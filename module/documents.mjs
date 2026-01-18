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
	_prepareDwarfData(actorData) {
		this.attributes = {
			sto: actorData.system.stoutness,
			def: actorData.system.deftness,
			wis: actorData.system.wisdom,
		};
        this.block = Math.ceil((actorData.system.armor.head + actorData.system.armor.body + actorData.system.armor.legs) / 3);
        const def = actorData.system.armor.def
        const skill = actorData.system.armor.skill;
        const parry = actorData.system.armor.parry;
        const misc = actorData.system.armor.misc;

        this.armorClass = this.block + def + skill + parry + misc + actorData.system.armor.block;
        this.passiveArmorClass = this.block + skill + misc + actorData.system.armor.block;
	}
}

export class SystemItem extends Item {
	prepareDerivedData() {
		super.prepareDerivedData();
		if (this.type === "skill") {
			this.level = Math.max(0, Math.floor(Math.log2(this.system.exp + 1)) - 1);
			this.nextLevel = Math.pow(2, this.level + 2) - 1;
			this.dice = skillDices[this.level] || "d4";
		}
        if (this.type === "resource") {
            this.assetValue = this.system.price * this.system.quantity;
        }
        if (this.type === "tool") {
            this.assetValue = this.system.price;
        }
        if(this.type === "weapon") {
            this.assetValue = this.system.price;
        }
	}

	async roll(actor) {
		if (this.type === "skill") {
			let roll = new Roll(this.dice, actor);
			let label = this.name ? game.i18n.format("sheet.rollDice", { label: this.name }) : "";
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: actor }),
				flavor: label,
			});
		}
		if (this.type === "weapon") {
			let roll = new Roll(this.system.formula, actor);
			let label = this.name ? game.i18n.format("sheet.rollDice", { label: this.name }) : "";
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: actor }),
				flavor: label,
			});
		}

		if(this.type === "action") {
			const roll = new Roll(this.system.formula, actor);
			let label = this.name ? game.i18n.format("sheet.rollDice", { label: this.name }) : "";
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: actor }),
				flavor: label,
			})
		}
	}
}
