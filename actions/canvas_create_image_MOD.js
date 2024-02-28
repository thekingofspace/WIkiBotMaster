  module.exports = {
  name: 'Canvas Create Image',
  section: 'Image Editing',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/canvas_create_image_MOD.js',
  },

  subtitle(data) {
    return `${data.url}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Image'];
  },

  fields: ['url', 'storage', 'varName'],

  html() {
    return `
<div>
  <span class="dbminputlabel">Local/Web URL</span>
  <input id="url" class="round" type="text" value="resources/"><br>
</div>
<br><br><br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const url = this.evalMessage(data.url, cache);

    // Check if the URL is an embeddable image (customize this check based on your needs)
    const isEmbeddableImage = url.includes('embed');

    if (isEmbeddableImage) {
      try {
        // Download the embeddable image using axios
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);

        // Continue with the existing code for loading and processing the image
        const Canvas = require('canvas');
        Canvas.loadImage(imageBuffer).then((image) => {
          const canvas = Canvas.createCanvas(image.width, image.height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, image.width, image.height);
          const result = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
          const varName = this.evalMessage(data.varName, cache);
          const storage = parseInt(data.storage, 10);
          this.storeValue(result, storage, varName, cache);
          this.callNextAction(cache);
        });
      } catch (error) {
        console.error('Error downloading embeddable image:', error);
        this.callNextAction(cache);
      }
    } else {
      // Continue with the existing code for loading and processing the image
      const Canvas = require('canvas');
      Canvas.loadImage(url).then((image) => {
        const canvas = Canvas.createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const result = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        const varName = this.evalMessage(data.varName, cache);
        const storage = parseInt(data.storage, 10);
        this.storeValue(result, storage, varName, cache);
        this.callNextAction(cache);
      });
    }
  },

  mod() {},
};
