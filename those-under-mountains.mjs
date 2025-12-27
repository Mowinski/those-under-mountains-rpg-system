import { SystemActor, SystemItem } from "./module/documents.mjs";
import { DwarfActorDataModel, WeaponDataModel, ToolDataModel } from "./module/data-models.mjs";
import { DwarfActorSheet } from "./module/sheet.mjs";

Hooks.once("init", () => {
	// Configure custom Document implementations.
	CONFIG.Actor.documentClass = SystemActor;
	CONFIG.Item.documentClass = SystemItem;

	// Configure System Data Models.
	CONFIG.Actor.dataModels = {
		dwarf: DwarfActorDataModel,
	};
	CONFIG.Item.dataModels = {
		weapon: WeaponDataModel,
		tool: ToolDataModel,
	};

	// Configure trackable attributes.
	CONFIG.Actor.trackableAttributes = {
		dwarf: {
			bar: ["resources.wounds"],
			value: ["stoutness", "deftness", "wisdom"],
		},
	};

	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("tum", DwarfActorSheet, {
		makeDefault: true,
		label: "tum.SheetClass.DwarfCharacter",
	});
});
