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
		hero: {
			bar: ["resources.wounds"],
			value: ["stoutness", "deftness", "wisdom"],
		},
	};
});
