import { levelChoices, skillDices } from "./consts.mjs";

export class TUMItemSheet extends ItemSheet {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["boilerplate", "sheet", "item"],
			template: "systems/those-under-mountains/templates/item-sheet.hbs",
			width: 400,
			height: 300,
		});
	}

	/** @override */
	getData() {
		const context = super.getData();

		const itemData = context.document;
		context.system = itemData.system;
		context.flags = itemData.flags;

		const calculatedLevel = Math.floor(Math.log2(context.system.exp + 1)) - 1;

		context.levelChoices = levelChoices;
		context.system.level = Math.max(0, calculatedLevel);
		context.currentLevel = game.i18n.localize(levelChoices[context.item.level] || "sheet.itemLevel.Level1");

		return context;
	}

	activateListeners(html) {
		super.activateListeners(html);
		if (!this.isEditable) return;

		html.on("click", ".promote-item", this._onPromoteItem.bind(this));
		html.on("click", ".demote-item", this._onDemoteItem.bind(this));
		html.find(".rollable").click(this._onRoll.bind(this));
	}

	async _onPromoteItem(event) {
		event.preventDefault();
		const currentExp = this.item.system.exp || 0;
		await this.item.update({ "system.exp": currentExp + 1 });
	}

	async _onDemoteItem(event) {
		event.preventDefault();
		const currentExp = this.item.system.exp || 0;

		if (currentExp > 0) {
			await this.item.update({ "system.exp": currentExp - 1 });
		}
	}

	_onRoll(event) {
		event.preventDefault();
		this.actor.items.get(this.object.id).roll(this.actor);
	}
}
