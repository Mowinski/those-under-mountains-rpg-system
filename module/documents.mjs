export class SystemActor extends Actor {
	async applyDamage() {
		damage = 1;

		// Update the health.
		const { value } = this.system.resources.wounds;
		await this.update({ "system.resources.wounds.value": value + damage });

		// Log a message.
		await ChatMessage.implementation.create({
			content: `${this.name} took damage!`,
		});
	}
}

export class SystemItem extends Item {
	get isFree() {
		return this.price < 1;
	}
}
