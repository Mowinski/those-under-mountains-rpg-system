import { SystemActor, SystemItem } from "./module/documents.mjs";
import {
	DwarfActorDataModel,
	HoldActorDataModel,
	WeaponDataModel,
	ToolDataModel,
	ResourceDataModel,
	SkillDataModel,
    FeatureDataModel,
} from "./module/data-models.mjs";
import { DwarfActorSheet } from "./module/dwarf-sheet.mjs";
import { HoldActorSheet } from "./module/hold-sheet.mjs";
import { TUMItemSheet } from "./module/item-sheet.mjs";
import { preloadHandlebarsTemplates } from "./module/templates.mjs";

Hooks.once("init", () => {
	// Configure custom Document implementations.
	CONFIG.Actor.documentClass = SystemActor;
	CONFIG.Item.documentClass = SystemItem;

	// Configure System Data Models.
	CONFIG.Actor.dataModels = {
		dwarf: DwarfActorDataModel,
		hold: HoldActorDataModel,
	};
	CONFIG.Item.dataModels = {
		weapon: WeaponDataModel,
		tool: ToolDataModel,
		resource: ResourceDataModel,
		skill: SkillDataModel,
        feat: FeatureDataModel,
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
	Actors.registerSheet("tum", HoldActorSheet, {
		label: "tum.SheetClass.Hold",
	});
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("tum", TUMItemSheet, {
		makeDefault: true,
		label: "tum.SheetClass.Item",
	});

	console.log("Those Under Mountains | Initialized those-under-mountains system");
	return preloadHandlebarsTemplates();
});
