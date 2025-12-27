/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
	return loadTemplates([
		"systems/those-under-mountains/templates/parts/features.hbs",
		"systems/those-under-mountains/templates/parts/features-aside.hbs",
		"systems/those-under-mountains/templates/parts/effects.hbs",
		"systems/those-under-mountains/templates/parts/items.hbs",
	]);
};
