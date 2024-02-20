module.exports = {
  name: "Check Image Format",

  section: "Conditions",

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
  },

  meta: { version: "1.0.0", author: null, authorUrl: null, downloadUrl: null },

  fields: ["storage", "varName", "branch"],

  html(isEvent, data) {
    return `
<retrieve-from-variable allowSlashParams dropdownLabel="Variable" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<hr class="subtlebar">

<br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(type, varName, cache);

    // Check if the variable is a string
    if (typeof variable === "string") {
      // Define supported image formats (add more if needed)
      const imageFormats = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

      // Check if the variable ends with any of the supported image formats
      const endsWithImageFormat = imageFormats.some(format => variable.toLowerCase().endsWith(format));

      // Execute results based on the condition
      this.executeResults(endsWithImageFormat, data?.branch ?? data, cache);
    } else {
      // If the variable is not a string, execute results as false
      this.executeResults(false, data?.branch ?? data, cache);
    }
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};
