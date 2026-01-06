import {featureTypes, itemQuality} from "./consts.mjs";

const { HTMLField, NumberField, SchemaField, StringField, ArrayField, DocumentUUIDField } = foundry.data.fields;

/* -------------------------------------------- */
/*  Actor Models                                */
/* -------------------------------------------- */

class ActorDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		// All Actors have resources.
		return {
			name: new StringField({ required: true, blank: false, initial: "New Actor" }),
			resources: new SchemaField({
				wounds: new SchemaField({
					min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
					value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
					max: new NumberField({ required: true, integer: true, min: 4, initial: 4 }),
				}),
			}),
			movementSpeed: new NumberField({ required: true, integer: true, min: 0, initial: 20 }),
			stoutness: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			deftness: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			wisdom: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			armor: new SchemaField({
				head: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				body: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				legs: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				block: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				parry: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				skill: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				def: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
				misc: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			}),
		};
	}
}

export class DwarfActorDataModel extends ActorDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			gold: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			features: new ArrayField(new DocumentUUIDField({ required: true, blank: false }), { required: true, blank: false, initial: [] }),
			background: new SchemaField({
				biography: new HTMLField({ required: true, blank: true }),
				visual: new HTMLField({ required: true, blank: true }),
				character: new HTMLField({ required: true, blank: true }),
				hold: new StringField({ required: true, blank: true }),
				ancestry: new StringField({ required: true, blank: true }),
				profession: new StringField({ required: true, blank: true }),
			}),
		};
	}
}

// The pawn does not have any different data to the base ActorDataModel, but we
// still define a data model for it, in case we have any special logic we want
// to perform only for pawns.
export class PawnDataModel extends ActorDataModel {}

/* -------------------------------------------- */
/*  Item Models                                 */
/* -------------------------------------------- */
class ItemDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		return {
			name: new StringField({ required: true, blank: false, initial: "New Item" }),
			description: new HTMLField({ required: true, blank: true }),
		};
	}
}

class BuyableItemDataModel extends ItemDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			quality: new StringField({
				required: true,
				blank: false,
				options: itemQuality,
				initial: "normal",
			}),
			price: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
		};
	}
}

export class WeaponDataModel extends BuyableItemDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			material: new StringField({ required: true, blank: false, initial: "iron" }),
			type: new StringField({ required: true, blank: false, initial: "polearm" }),
			formula: new StringField({ required: true, blank: false, initial: "1d6+@attributes.sto" }),
		};
	}
}

export class ToolDataModel extends BuyableItemDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			material: new StringField({ required: true, blank: false, initial: "iron" }),
		};
	}
}

export class ResourceDataModel extends BuyableItemDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			type: new StringField({ required: true, blank: false, initial: "ore" }),
            quantity: new NumberField({ required: true, integer: true, min: 0, initial: 1 }),
			created_date: new NumberField({ required: true, blank: false, initial: 0 }),
			expiration_date: new StringField({ required: true, blank: true, initial: "" }),
		};
	}
}

export class SkillDataModel extends ItemDataModel {
	static defineSchema() {
		return {
			name: new StringField({ required: true, blank: false, initial: "New Skill" }),
			description: new HTMLField({ required: true, blank: true }),
			exp: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
		};
	}

	static migrateData(source) {
		if (Number.isNumeric(source.level)) {
			source.exp = source.level === 0 ? 0 : Math.pow(2, source.level) - 1;
		}
		return super.migrateData(source);
	}
}

export class FeatureDataModel extends ItemDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			featureType: new StringField({ required: true, blank: false, options: featureTypes, initial: "trade" }),
			prerequisite: new ArrayField(new StringField({ required: true, blank: false }), { required: true, blank: false, initial: [] }),
		};
	}
}