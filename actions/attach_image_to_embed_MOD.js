module.exports = {
  name: 'Attach Image To Embed',
  section: 'Embed Message',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/attach_image_to_embed_MOD.js',
  },

  subtitle(data) {
    const array = ['Temp Variable', 'Server Variable', 'Global Variable'];
    return `Attach (${array[data.embedstorage - 1]} ${data.embedvarName}) (${data.filename || 'image.png'})`;
  },

  fields: ['embedstorage', 'embedvarName', 'imageurls'],

  html() {
    return `
<div>
  <store-in-variable dropdownLabel="Source Embed Object" selectId="embedstorage" variableInputId="embedvarName" variableContainerId="varNameContainer"></store-in-variable>
</div>
<br><br><br>

<div>
  <span class="dbminputlabel">Image URLs (separate with commas)</span>
  <textarea id="imageurls" class="round" placeholder="Paste image URLs here"></textarea><br>
</div>`;

  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Actions } = this.getDBM();

    const embedstorage = parseInt(data.embedstorage, 10);
    const embedvarName = this.evalMessage(data.embedvarName, cache);
    const embed = this.getVariable(embedstorage, embedvarName, cache);

    const imageurls = this.evalMessage(data.imageurls, cache);
    const imageUrlsArray = imageurls.split(',');

    const DBM = this.getDBM();
    const { MessageEmbed } = DBM.DiscordJS;

    const embedsArray = [];

    for (const imageUrl of imageUrlsArray) {
      const trimmedImageUrl = imageUrl.trim();
      if (trimmedImageUrl) {
        const newEmbed = new MessageEmbed().setImage(trimmedImageUrl);
        embedsArray.push(newEmbed);
      }
    }

    const storage = parseInt(data.storage, 10);
    const varName = Actions.evalMessage(data.varName, cache);

    Actions.storeValue(embedsArray, storage, varName, cache);

    this.callNextAction(cache);
  },

  mod() {},
};
