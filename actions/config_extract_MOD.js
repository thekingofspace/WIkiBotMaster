module.exports = {
  name: 'Extract Config Text',
  section: 'Config Controls',
  meta: {
    version: '2.1.8',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/find_text_MOD.js',
  },

  subtitle(data) {
    return `Find text between "${data.symbolPair}"`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },
  fields: ['text', 'symbolPair', 'storage', 'varName'],

  html() {
    return `
<div style="float: left; width: 50%; padding-top: 8px;">
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

<div style="float: left; width: 48%; padding-top: 8px;">
  <span class="dbminputlabel">Source Text</span>
  <textarea id="text" rows="3" placeholder="Insert text here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>
<br><br><br>

<div style="float: left; width: 99%; padding-top: 8px;">
  <span class="dbminputlabel">Store In</span>
  <div style="width: calc(95% - 8px);"> <!-- Adjusted width -->
    <store-in-variable dropdownLabel="" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>
</div>

<div style="float: left; width: 99%; padding-top: 8px;">
  <p>
    This action will output the text between the specified symbol pair in the source text.
  </p>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    let text = this.evalMessage(data.text, cache);
    const symbolPair = this.evalMessage(data.symbolPair, cache);

    if (!symbolPair) return console.log('Find Text: Symbol pair is missing!');
    if (!text) return console.log('Find Text: Source text is missing!');
    
    const startSymbol = symbolPair.charAt(0);
    const endSymbol = symbolPair.charAt(1);

    let result = '';
    let startIndex = text.indexOf(startSymbol);
    let endIndex = text.lastIndexOf(endSymbol);

    while (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      result += text.substring(startIndex + 1, endIndex);
      text = text.substring(0, startIndex) + text.substring(endIndex + 1);
      startIndex = text.indexOf(startSymbol);
      endIndex = text.lastIndexOf(endSymbol);
    }

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};