import { levelChoices, flattenedSkillList, ancestries } from "./consts.mjs";
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
	async getData() {
		// Retrieve the data structure from the base sheet. You can inspect or log
		// the context variable to see the structure, but some key properties for
		// sheets are the actor object, the data object, whether or not it's
		// editable, the items array, and the effects array.
		const context = super.getData();
		context.ancestries = ancestries;
		const actorData = context.document;

		context.system = actorData.system;
		context.flags = actorData.flags;
		const pack = game.packs.get("those-under-mountains.features");
		const availableFeatures = await pack.getDocuments();
		context.availableFeatures = this._groupFeatures(availableFeatures);
		// Prepare character data and items.
		this._prepareItems(context);
		this._prepareCharacterData(context);
		this._prepareActiveEffectCategories(context, this.actor.allApplicableEffects());
		this._prepareFeatures(context);

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
		const weapons = [];
		const tools = [];
		const skills = [];
        const resources = [];
		const features = []
        context.totalResourcesValue = 0;
        context.totalToolsValue = 0;
        context.totalWeaponsValue = 0;
        context.totalExp = 0

		for (let i of this.actor.items) {
			i.img = i.img || DEFAULT_TOKEN;
			if (i.type === "weapon") {
				weapons.push(i);
                context.totalWeaponsValue += i.assetValue;
			} else if (i.type === "tool") {
				tools.push(i);
                context.totalToolsValue += i.assetValue;
			} else if (i.type === "skill") {
				i.currentLevel = game.i18n.localize(levelChoices[i.level] || "sheet.itemLevel.Level1");
				i.plainDescription = htmlToPlainText(i.system.description);
                context.totalExp += i.system.exp;
				skills.push(i);
			}
            else if (i.type === "resource") {
                resources.push(i);
                context.totalResourcesValue += i.assetValue;
            }
			else if (i.type === "feat") {
				features.push(i);
			}
		}

		// Assign and return
		context.weapons = weapons;
		context.tools = tools;
        context.resources = resources;
		context.features = this._groupFeatures(features);
		context.skills = skills.sort((a, b) => b.system.exp - a.system.exp);
		context.skillsList = flattenedSkillList;
	}

	_prepareFeatures() {

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
			const parent = $(ev.currentTarget).parents("tr");
			const item = this.actor.items.get(parent.data("itemId"));
			item.sheet.render(true);
		});

		// -------------------------------------------------------------
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		html.on("click", ".skill-create", this._onSkillCreate.bind(this));
		html.on("click", ".item-create", this._onItemCreate.bind(this));
		html.on("click", ".resource-create", this._onResourceCreate.bind(this));
		html.on("click", ".item-delete", this._onItemDelete.bind(this));
		html.on("click", ".item-preview", this._onFeaturePreview.bind(this));
		html.on("click", "#add-feature", this._onFeatureAdd.bind(this));

		// Active Effect management
		html.on("click", ".effect-control", (ev) => {
			const row = ev.currentTarget.closest("li");
			const document = row.dataset.parentId === this.actor.id ? this.actor : this.actor.items.get(row.dataset.parentId);
			onManageActiveEffect(ev, document);
		});

		html.on("click", ".rollable", this._onRoll.bind(this));
	}

	async _onFeaturePreview(event) {
		event.preventDefault();
		const selectedFeatureId = $('#addNewFeature').val();
		const pack = game.packs.get("those-under-mountains.features");
		const feat = await pack.getDocument(selectedFeatureId);
		if(!feat) return;
		feat.sheet.render(true)
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

    async _onResourceCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;

        const type = header.dataset.type;

        const name = `New ${type.capitalize()}`;
        const itemData = {
            name: name,
            type: type,
            created_date: game.time.worldTime,
        };

        console.log("Creating item with data:", itemData);
        return await Item.create(itemData, { parent: this.actor });
    }

	async _onItemDelete(event) {
		const parent = $(event.currentTarget).parents("tr");
		const item = this.actor.items.get(parent.data("itemId"));
		item.delete();
		parent.slideUp(200, () => this.render(false));
	}
	
	async _onFeatureAdd(event) {
		event.preventDefault();
		const selectedFeatureId = $('#addNewFeature').val();
		const pack = game.packs.get("those-under-mountains.features");
		const itemData = (await pack.getDocument(selectedFeatureId)).toObject();

		this.actor.createEmbeddedDocuments("Item", [itemData]);
		ui.notifications.info("Feature added successfully!");
		console.log(selectedFeatureId);
	}

	_onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;

		if (dataset.roll) {
			let roll = new Roll(dataset.roll, this.actor);
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

	_groupFeatures(features) {
		features = features.sort((a, b) => a.name.localeCompare(b.name));
		return {
			trade: features.filter((f) => f.system.featureType === "trade"),
			martial: features.filter((f) => f.system.featureType === "martial"),
			ancestry: features.filter((f) => f.system.featureType === "ancestry"),
			other: features.filter((f) => f.system.featureType === "other"),
		};
	}
}
