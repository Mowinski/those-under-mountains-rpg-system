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
		context.levelChoices = levelChoices;
		context.currentLevel = game.i18n.localize(levelChoices[context.system.level] || "sheet.itemLevel.Level1");
		context.modifier = skillDices[context.system.level] || "d4";
		console.log(context, "Item Sheet Context");
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
		const currentLevel = this.item.system.level || 0;
		if (currentLevel < 5) {
			await this.item.update({ "system.level": currentLevel + 1 });
		}
	}

	async _onDemoteItem(event) {
		event.preventDefault();
		const currentLevel = this.item.system.level || 0;
		if (currentLevel > 0) {
			await this.item.update({ "system.level": currentLevel - 1 });
		}
	}

	_onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;

		if (dataset.roll) {
			let roll = new Roll(dataset.roll, this);
			let label = dataset.label ? `Rolling ${dataset.label}` : "";
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
			});
		}
	}
}
