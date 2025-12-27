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
		const actorData = this;

		// Make separate methods for each Actor type (character, npc, etc.) to keep
		// things organized.
		this._prepareCharacterData(actorData);
	}

	/**
	 * Prepare Character type specific data
	 */
	_prepareCharacterData(actorData) {
		if (actorData.type !== "dwarf") return;

		for (let [key, skill] of Object.entries(actorData.skills)) {
			if (skill.level === 0) skill.mod = "d4";
			else if (skill.level === 1) skill.mod = "d6";
			else if (skill.level === 2) skill.mod = "d8";
			else if (skill.level === 3) skill.mod = "d10";
			else if (skill.level === 4) skill.mod = "d12";
		}
	}


	async applyDamage() {
		damage = 1;

		// Update the health.
		const { value } = this.system.resources.wounds;
		await this.update({ "system.resources.wounds.value": value + damage });

		// Log a message.
		await ChatMessage.implementation.create({
			content: `${this.name} took damage!`,
		});
	}
}

export class SystemItem extends Item {
	get isFree() {
		return this.price < 1;
	}
}
