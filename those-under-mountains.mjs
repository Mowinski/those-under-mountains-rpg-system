import { SystemActor, SystemItem } from "./module/documents.mjs";
import {
	DwarfActorDataModel,
	WeaponDataModel,
	ToolDataModel,
	ResourceDataModel,
	SkillDataModel,
} from "./module/data-models.mjs";
import { DwarfActorSheet } from "./module/dwarf-sheet.mjs";
import { preloadHandlebarsTemplates } from "./module/templates.mjs";

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
		resource: ResourceDataModel,
		skill: SkillDataModel,
	};

	CONFIG.Item

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

	console.log("Those Under Mountains | Initialized those-under-mountains system");
	return preloadHandlebarsTemplates();
});
