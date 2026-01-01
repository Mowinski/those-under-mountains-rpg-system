export class DwarfActorSheet extends ActorSheet {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["boilerplate", "sheet", "actor"],
			template: "systems/those-under-mountains/templates/dwarf-sheet.hbs",
			width: 600,
			height: 600,
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "attributes",
				},
			],
		});
	}

	/** @override */
	getData() {
		// Retrieve the data structure from the base sheet. You can inspect or log
		// the context variable to see the structure, but some key properties for
		// sheets are the actor object, the data object, whether or not it's
		// editable, the items array, and the effects array.
		const context = super.getData();
		const actorData = context.document;

		context.system = actorData.system;
		context.flags = actorData.flags;

		// Prepare character data and items.
		this._prepareItems(context);
		this._prepareCharacterData(context);
		this._prepareActiveEffectCategories(context, this.actor.allApplicableEffects());

		console.log(context, "Dwarf Actor Sheet Context");
		return context;
	}

	_prepareCharacterData(context) {
		context.sto = game.i18n.localize("tum.Ability.Sto.long");
		context.def = game.i18n.localize("tum.Ability.Def.long");
		context.wis = game.i18n.localize("tum.Ability.Wis.long");

		context.stoValue = context.system.stoutness;
		context.defValue = context.system.deftness;
		context.wisValue = context.system.wisdom;
	}

	/**
	 * Organize and classify Items for Character sheets.
	 *
	 * @param {Object} actorData The actor to prepare.
	 *
	 * @return {undefined}
	 */
	_prepareItems(context) {
		const weapon = [];
		const tool = [];
		const skills = [];

		for (let i of context.items) {
			i.img = i.img || DEFAULT_TOKEN;
			if (i.type === "weapon") {
				weapon.push(i);
			} else if (i.type === "tool") {
				tool.push(i);
			} else if (i.type === "skill") {
				skills.push(i);
			}
		}

		// Assign and return
		context.weapon = weapon;
		context.tool = tool;
		context.skills = skills;
	}

	_prepareActiveEffectCategories(context, effects) {
		const categories = {
			temporary: {
				type: "temporary",
				label: game.i18n.localize("BOILERPLATE.Effect.Temporary"),
				effects: [],
			},
			passive: {
				type: "passive",
				label: game.i18n.localize("BOILERPLATE.Effect.Passive"),
				effects: [],
			},
			inactive: {
				type: "inactive",
				label: game.i18n.localize("BOILERPLATE.Effect.Inactive"),
				effects: [],
			},
		};

		// Iterate over active effects, classifying them into categories
		for (let e of effects) {
			if (e.disabled) categories.inactive.effects.push(e);
			else if (e.isTemporary) categories.temporary.effects.push(e);
			else categories.passive.effects.push(e);
		}
		context.effects = categories;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Render the item sheet for viewing/editing prior to the editable check.
		html.on("click", ".item-edit", (ev) => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.sheet.render(true);
		});

		// -------------------------------------------------------------
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Add Inventory Item
		html.on("click", ".item-create", this._onItemCreate.bind(this));

		html.on("click", ".skill-create", this._onItemCreate.bind(this));

		// Delete Inventory Item
		html.on("click", ".item-delete", (ev) => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.delete();
			li.slideUp(200, () => this.render(false));
		});

		html.on("click", ".skill-delete", this._onSkillDelete.bind(this));

		// Active Effect management
		html.on("click", ".effect-control", (ev) => {
			const row = ev.currentTarget.closest("li");
			const document = row.dataset.parentId === this.actor.id ? this.actor : this.actor.items.get(row.dataset.parentId);
			onManageActiveEffect(ev, document);
		});

		// Rollable abilities.
		html.on("click", ".rollable", this._onRoll.bind(this));
	}

	async _onItemCreate(event) {
		event.preventDefault();
		const header = event.currentTarget;

		const type = header.dataset.type;
		const data = duplicate(header.dataset);
		const name = `New ${type.capitalize()}`;
		const itemData = {
			name: name,
			type: type,
			data: data,
		};

		delete itemData.data["type"];
		console.log("Creating item with data:", itemData);
		return await Item.create(itemData, { parent: this.actor });
	}

	async _onSkillDelete(event) {
		const li = $(event.currentTarget).parents(".skill");
		const skillId = li.data("skillId");
		console.log("Deleting skill with ID:", skillId);

		const updatedSkills = this.actor.system.skills.filter((s) => s._id !== skillId);
		await this.actor.update({ "system.skills": updatedSkills });

		li.slideUp(200, () => this.render(false));
	}

	async _onSkillCreate(event) {
		event.preventDefault();
		const header = event.currentTarget;
		const type = header.dataset.type;

		const skillData = {
			_id: foundry.utils.randomID(),
			name: `New ${type.capitalize()}`,
			description: "",
			level: 0,
		};

		const updatedSkills = [...this.actor.system.skills, skillData];
		await this.actor.update({ "system.skills": updatedSkills });
	}

	async _onRoll(event) {
		event.preventDefault();
		console.log("Roll handler not yet implemented.");
	}
}
