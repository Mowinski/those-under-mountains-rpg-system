import { SystemActor, SystemItem } from "./module/documents.mjs";
import { DwarfActorDataModel, WeaponDataModel, ToolDataModel } from "./module/data-models.mjs";

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

	const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

	DocumentSheetConfig.unregisterSheet(Actor, "core", foundry.appv1.sheets.ActorSheet);
	DocumentSheetConfig.registerSheet(Actor, "tum", applications.actor.CharacterActorSheet, {
		types: ["dwarf"],
		makeDefault: true,
		label: "tum.SheetClass.Character",
	});
});
