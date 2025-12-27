const { HTMLField, NumberField, SchemaField, StringField, ArrayField } = foundry.data.fields;

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
		};
	}
}

export class DwarfActorDataModel extends ActorDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			background: new SchemaField({
				biography: new HTMLField({ required: true, blank: true }),
				hold: new StringField({ required: true, blank: true }),
				ancestry: new StringField({ required: true, blank: true }),
				profession: new StringField({ required: true, blank: true }),
			}),
			skills: new ArrayField(
				new SchemaField({
					name: new StringField({ required: true, blank: false, initial: "New Skill" }),
					description: new HTMLField({ required: true, blank: true }),
					level: new NumberField({ required: true, integer: true, min: 0, max: 5, initial: 0 }),
				})
			),
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

export class WeaponDataModel extends ItemDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
		};
	}
}

export class ToolDataModel extends ItemDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
		};
	}
}
