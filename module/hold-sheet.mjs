import {levelChoices} from "./consts.mjs";
import {htmlToPlainText} from "./templates.mjs";

export class HoldActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["boilerplate", "sheet", "actor"],
            template: "systems/those-under-mountains/templates/hold-sheet.hbs",
            width: 600,
            height: 600,
        });
    }

    async getData() {
        // Retrieve the data structure from the base sheet. You can inspect or log
        // the context variable to see the structure, but some key properties for
        // sheets are the actor object, the data object, whether or not it's
        // editable, the items array, and the effects array.
        const context = super.getData();
        const actorData = context.document;

        context.system = actorData.system;
        context.flags = actorData.flags
        this._prepareItems(context);

        return context;
    }

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
        context.features = features;
        context.skills = skills.sort((a, b) => b.system.exp - a.system.exp);
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on("click", ".item-edit", (ev) => {
            const parent = $(ev.currentTarget).parents("tr");
            const item = this.actor.items.get(parent.data("itemId"));
            item.sheet.render(true);
        });

        if (!this.isEditable) return;

        html.on("click", ".item-create", this._onItemCreate.bind(this));
        html.on("click", ".resource-create", this._onResourceCreate.bind(this));
        html.on("click", ".item-delete", this._onItemDelete.bind(this));
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
}