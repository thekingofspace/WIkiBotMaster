module.exports = {
  name: 'Write Config',
  section: 'Config Controls',
  meta: {
    version: '2.1.8',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/find_text_MOD.js',
  },

  subtitle(data) {
    return `Edit text inside "${data.symbolPair}"`;
  },

  fields: ['text1', 'text2', 'symbolPair', 'storage', 'varName'],

  html() {
    return `
<div style="float: left; width: 49%; padding-top: 8px;">
  <span class="dbminputlabel">Text 1</span>
  <textarea id="text1" rows="3" placeholder="Insert text here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>

<div style="float: left; width: 49%; padding-top: 8px; padding-left: 2%;">
  <span class="dbminputlabel">Text 2</span>
  <textarea id="text2" rows="3" placeholder="Insert text here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>

<div style="float: left; width: 99%; padding-top: 8px;">
  <span class="dbminputlabel">Symbol Pair</span>
  <select id="symbolPair" class="round">
    <option value="[]">[ ]</option>
    <option value="{}">{ }</option>
    <option value="\\">\\</option>
    <option value="|">|</option>
    <option value="\`">\`</option>
    <option value="&quot;">&quot;</option>
    <option value="'">'</option>
    <option value="()">( )</option>
  </select>
</div>

<div style="float: left; width: 99%; padding-top: 8px;">
  <span class="dbminputlabel">Store In</span>
  <div style="width: calc(95% - 8px);"> <!-- Adjusted width -->
    <store-in-variable dropdownLabel="" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    let text1 = this.evalMessage(data.text1, cache);
    const text2 = this.evalMessage(data.text2, cache);
    const symbolPair = this.evalMessage(data.symbolPair, cache);

    if (!symbolPair) return console.log('Edit Text: Symbol pair is missing!');
    if (!text1 || !text2) return console.log('Edit Text: Both text inputs are required!');

    const startSymbol = symbolPair.charAt(0);
    const endSymbol = symbolPair.charAt(1);

    const startIndex = text1.indexOf(startSymbol);
    const endIndex = text1.lastIndexOf(endSymbol);

    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex)
      return console.log(`Edit Text: The specified text between symbols wasn't found in the source text!\nSource text: ${text1}\nSymbol pair: ${symbolPair}`);

    const newText = text1.substring(0, startIndex + 1) + text2 + text1.substring(endIndex);

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(newText, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};