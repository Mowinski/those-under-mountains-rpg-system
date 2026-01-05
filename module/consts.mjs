export const skillDices = {
	0: "1d4", // Novice
	1: "1d4", // Proficient
	2: "1d6", // Skilled
	3: "1d8", // Expert
	4: "1d10",
};

export const ancestries = {
	Duergar: "ancestry.Duergar",
	Espantekatl: "ancestry.Espantekatl",
	FirFriemhe: "ancestry.FirFriemhe",
	Fjallafolk: "ancestry.Fjallafolk",
	TheForged: "ancestry.TheForged",
	Gnomes: "ancestry.Gnomes",
	LuddenavBrieg: "ancestry.LuddenavBrieg",
	Troglin: "ancestry.Troglin",
};

export const levelChoices = {
	0: "sheet.itemLevel.Level0",
	1: "sheet.itemLevel.Level1",
	2: "sheet.itemLevel.Level2",
	3: "sheet.itemLevel.Level3",
	4: "sheet.itemLevel.Level4",
	5: "sheet.itemLevel.Level5",
};

export const skillList = {
	adventure: {
		athletic: "skill.adventure.athletic",
		diplomacy: "skill.adventure.diplomacy",
		investigation: "skill.adventure.investigation",
		perception: "skill.adventure.perception",
		stealth: "skill.adventure.stealth",
		riding: "skill.adventure.riding",
	},
	trade: {
		blacksmith: "skill.trade.blacksmith",
		brewing: "skill.trade.brewing",
		butchery: "skill.trade.butchery",
		carpentry: "skill.trade.carpentry",
		cooking: "skill.trade.cooking",
		engineering: "skill.trade.engineering",
		farming: "skill.trade.farming",
		gemCutting: "skill.trade.gemCutting",
		herbalism: "skill.trade.herbalism",
		hunting: "skill.trade.hunting",
		masonry: "skill.trade.masonry",
		mining: "skill.trade.mining",
		pottery: "skill.trade.pottery",
	},
	martial: {
		duelist: "skill.martial.duelist",
		marksdwarf: "skill.martial.marksdwarf",
		pikedwarf: "skill.martial.pikedwarf",
		poledwarf: "skill.martial.poledwarf",
		shielddwarf: "skill.martial.shielddwarf",
	},
};

export const flattenedSkillList = Object.values(skillList).reduce((acc, category) => {
	return { ...acc, ...category };
}, {});

export const itemQuality = ["normal", "good", "perfect"]