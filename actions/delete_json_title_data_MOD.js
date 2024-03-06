module.exports = {
  name: 'Delete JSON Title Data',
  section: 'Json Data',
  meta: {
    version: '2.1.8',
    author: 'DBM Mods',
  },

  subtitle(data) {
    return `Remove JSON Section from "${data.filename}"`;
  },

  fields: ['filename', 'title'],

  html() {
    return `
<div>
  <span class="dbminputlabel">File Path</span>
  <input id="filename" class="round" type="text">
</div>
<br><br>

<div>
  <span class="dbminputlabel">Title</span>
  <input id="title" class="round" type="text">
</div>
</div>
`;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { writeFileSync, readFileSync, existsSync } = require('fs');
    const path = this.evalMessage(data.filename, cache);
    const title = this.evalMessage(data.title, cache);

    try {
      if (path) {
        let jsonData = [];

        // Check if the file already exists
        if (existsSync(path)) {
          // Read existing content
          const existingContent = readFileSync(path, 'utf8');

          try {
            // Parse existing JSON data
            jsonData = JSON.parse(existingContent);
          } catch (err) {
            // Handle parsing error if needed
          }
        }

        // Find the entry with the specified title
        const entryIndex = jsonData.findIndex((item) => item.Title === title);

        // If the title exists, delete the entire entry
        if (entryIndex !== -1) {
          jsonData.splice(entryIndex, 1);
        }

        // Write the updated JSON data back to the file
        writeFileSync(path, JSON.stringify(jsonData, null, 2), 'utf8');
      } else {
        console.log('File path is missing from Remove JSON Section action!');
      }
    } catch (err) {
      console.error(`ERROR! ${err.stack || err}`);
    }

    this.callNextAction(cache);
  },

  mod() {},
};