const { HTMLField, NumberField, SchemaField, StringField, ArrayField, DocumentIdField } = foundry.data.fields;

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
			stoutness: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			deftness: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			wisdom: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			armorClass: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
			passiveArmorClass: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
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
			background: new SchemaField({
				biography: new HTMLField({ required: true, blank: true }),
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
			rarity: new StringField({
				required: true,
				blank: false,
				options: ["common", "uncommon", "rare", "legendary"],
				initial: "common",
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
			created_date: new StringField({ required: true, blank: false, initial: "" }),
			expiration_date: new StringField({ required: true, blank: false, initial: "" }),
		};
	}
}

export class SkillDataModel extends ItemDataModel {
	static defineSchema() {
		return {
			name: new StringField({ required: true, blank: false, initial: "New Skill" }),
			description: new HTMLField({ required: true, blank: true }),
			level: new NumberField({ required: true, integer: true, min: 0, max: 5, initial: 0 }),
		};
	}
}
