module.exports = {
  name: 'Delete Folder',
  section: 'Raikin Mods',
  meta: {
    version: '2.1.7',
    author: 'Raikin',
    description: 'Deletes a folder specified by the path.',
  },
  fields: ['folderpath'],

  subtitle(data) {
    return `Delete Folder: ${data.folderpath}`;
  },

  html() {
    return `
    <style>
      .col-100 {
        float: left;
        width: 100%;
      }
    </style>

    <div id="wrexdiv" style="width: 550px; height: 150px;">
      <div style="padding: 5px 10px;">
        <div style="float: left; width: 100%;">
          <span class="dbminputlabel">Folder Path</span>
          <textarea class="round col-100" id="folderpath" placeholder="Example Path = ./logs/date/example-date/" class="round" type="textarea" rows="3"></textarea><br>
        </div>
      </div>
    </div>`;
  },

  async action(cache) {
    const path = require('path');
    const Mods = this.getMods();
    const fs = Mods.require('fs-extra');

    const data = cache.actions[cache.index];
    const folderPath = path.normalize(this.evalMessage(data.folderpath, cache));

    try {
      if (folderPath) {
        fs.removeSync(folderPath);
      } else {
        throw new Error('You did not set a folder path, please go back and check your work.');
      }
    } catch (err) {
      return console.error(`ERROR ${err.stack || err}`);
    }

    this.callNextAction(cache);
  },

  mod() {},
};
