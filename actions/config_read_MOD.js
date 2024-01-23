module.exports = {
  name: 'Read Config',
  section: 'Config Controls',
  meta: {
    version: '2.1.8',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/find_text_MOD.js',
  },

  subtitle(data) {
    return `Read line ${data.lineNumber}`;
  },

  fields: ['text', 'lineNumber', 'storage', 'varName'],

  html() {
    return `
<div style="float: left; width: 49%; padding-top: 8px;">
  <span class="dbminputlabel">Text</span>
  <textarea id="text" rows="3" placeholder="Insert text here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>

<div style="float: left; width: 49%; padding-top: 8px; padding-left: 2%;">
  <span class="dbminputlabel">Line Number</span>
  <input id="lineNumber" class="round" type="text">
</div>

<div style="float: left; width: 99%; padding-top: 8px;">
  <div style="width: calc(95% - 8px);"> <!-- Adjusted width -->
    <store-in-variable dropdownLabel="Store In" selectId="message" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    try {
      const data = cache.actions[cache.index];
      const text = this.evalMessage(data.text, cache);
      const lineNumber = parseInt(this.evalMessage(data.lineNumber, cache), 10);

      if (!text || isNaN(lineNumber) || lineNumber < 1)
        return console.log('Read Specific Line: Invalid input. Please provide a valid text and line number.');

      const lines = text.split('\n');

      if (lineNumber > lines.length)
        return console.log('Read Specific Line: The specified line number is greater than the total number of lines.');

      const result = lines[lineNumber - 1];

      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);

      // Check if the 'path' variable is truthy
      const path = /* Replace this with your condition */ true;

      if (path) {
        this.storeValue(result, storage, varName, cache);
      } else {
        console.log(' ');
      }
    } catch (err) {
      console.error(`ERROR! ${err.stack || err}`);
    }
    this.callNextAction(cache);
  },

  mod() {},
};