import { levelChoices, flattenedSkillList } from "./consts.mjs";
import { htmlToPlainText } from "./templates.mjs";

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

		for (let i of this.actor.items) {
			console.log("Processing item:", i);
			console.log(this.actor.items.get(i._id), "Found item in actor items");
			i.img = i.img || DEFAULT_TOKEN;
			if (i.type === "weapon") {
				weapon.push(i);
			} else if (i.type === "tool") {
				tool.push(i);
			} else if (i.type === "skill") {
				i.currentLevel = game.i18n.localize(levelChoices[i.level] || "sheet.itemLevel.Level1");
				i.plainDescription = htmlToPlainText(i.system.description);
				skills.push(i);
			}
		}

		// Assign and return
		context.weapon = weapon;
		context.tool = tool;
		context.skills = skills.sort((a, b) => b.system.exp - a.system.exp);
		context.skillsList = flattenedSkillList;
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
		html.on("click", ".skill-create", this._onSkillCreate.bind(this));

		// Delete Inventory Item
		html.on("click", ".item-delete", this._onItemDelete.bind(this));

		// Active Effect management
		html.on("click", ".effect-control", (ev) => {
			const row = ev.currentTarget.closest("li");
			const document = row.dataset.parentId === this.actor.id ? this.actor : this.actor.items.get(row.dataset.parentId);
			onManageActiveEffect(ev, document);
		});

		// Rollable abilities.
		html.on("click", ".rollable", this._onRoll.bind(this));
	}
	async _onSkillCreate(event) {
		event.preventDefault();
		const skillName = $('[name="newSkill"]').val();
		const header = event.currentTarget;
		const data = duplicate(header.dataset);

		const itemData = {
			name: skillName,
			type: "skill",
			data: data,
		};

		console.log("Creating skill with data:", itemData);
		return await Item.create(itemData, { parent: this.actor });
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

	async _onItemDelete(event) {
		const li = $(event.currentTarget).parents(".item");
		const item = this.actor.items.get(li.data("itemId"));
		item.delete();
		li.slideUp(200, () => this.render(false));
	}

	_onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;

		if (dataset.roll) {
			let roll = new Roll(dataset.roll, this);
			let label = dataset.label ? game.i18n.format("sheet.rollDice", { label: dataset.label }) : "";
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
			});
		}
		if (dataset.rollId) {
			const item = this.actor.items.get(dataset.rollId);
			if (item) {
				item.roll(this.actor);
			}
		}
	}
}
