module.exports = {
  name: 'Average Calculator',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'raikin',
    authorUrl: 'https://yourwebsite.com',
    downloadURL: 'https://github.com/yourrepository/average_calculator_MOD.js',
  },

  subtitle() {
    return 'Average Calculator';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Number'];
  },

  fields: ['Numbers', 'storage', 'varName'],

  html() {
    return `
<div style="width: 90%;">
  <span class="dbminputlabel">Numbers (Separated by spaces or newlines)</span>
  <textarea id="Numbers" class="round" rows="4"></textarea>
</div><br>

<br><br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const numbersString = this.evalMessage(data.Numbers, cache);
    const numbersArray = numbersString.split(/\s+/);

    let sum = 0;
    let count = 0;

    for (const numberString of numbersArray) {
      const number = parseFloat(numberString);

      if (!isNaN(number)) {
        sum += number;
        count++;
      }
    }

    let result;

    if (count > 0) {
      result = Math.round((sum / count) * 10) / 10;
    } else {
      result = 0;
    }

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(result, storage, varName, cache);

    this.callNextAction(cache);
  },

  mod() {},
};