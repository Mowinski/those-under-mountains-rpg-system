/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
	return loadTemplates([
		"systems/those-under-mountains/templates/parts/features.hbs",
		"systems/those-under-mountains/templates/parts/attributes.hbs",
		"systems/those-under-mountains/templates/parts/effects.hbs",
		"systems/those-under-mountains/templates/parts/items.hbs",
		"systems/those-under-mountains/templates/parts/header.hbs",
		"systems/those-under-mountains/templates/parts/skills.hbs",
		"systems/those-under-mountains/templates/parts/description.hbs",
	]);
};

export function htmlToPlainText(html) {
	if (!html) return "";

	let text = html;

	// 1. Obsługa list: każdy element listy od nowej linii z myślnikiem
	text = text.replace(/<li[^>]*>/gi, "\n - ");
	text = text.replace(/<\/li>/gi, "");
	text = text.replace(/<(ul|ol)[^>]*>|<\/(ul|ol)>/gi, "\n");

	// 2. Obsługa akapitów i linii
	text = text.replace(/<p[^>]*>/gi, "");
	text = text.replace(/<\/p>/gi, "\n"); // Zamknij akapit enterem
	text = text.replace(/<br\s*\/?>/gi, "\n");

	// 3. Usuń wszystkie pozostałe tagi HTML
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = text;

	// 4. Pobierz tekst (to załatwi też encje typu &nbsp;)
	let finalString = tempDiv.textContent || tempDiv.innerText || "";

	// 5. Kosmetyka: usuń potrójne entery i wyczyść białe znaki na końcach
	return finalString.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
}

