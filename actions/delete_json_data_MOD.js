module.exports = {
  name: 'Delete JSON Content Data',
  section: 'Json Data',
  meta: {
    version: '2.1.8',
    author: 'DBM Mods',
  },

  subtitle(data) {
    return `Delete JSON Data from "${data.filename}"`;
  },

  fields: ['filename', 'title', 'contentTitle'],

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
<br>

<div>
  <span class="dbminputlabel">Content Title</span>
  <input id="contentTitle" class="round" type="text" placeholder="Use / to navigate nested content">
</div>
</div>
`;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { writeFileSync, readFileSync, existsSync } = require('fs');
    const path = this.evalMessage(data.filename, cache);
    const title = this.evalMessage(data.title, cache);
    const contentTitle = this.evalMessage(data.contentTitle, cache);

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

        // If the title exists, delete the entry and its nested content
        if (entryIndex !== -1) {
          if (contentTitle && contentTitle.includes('/')) {
            const nestedTitles = contentTitle.split('/');
            let currentContent = jsonData[entryIndex];

            for (let i = 0; i < nestedTitles.length; i++) {
              const nestedTitle = nestedTitles[i];

              if (i === nestedTitles.length - 1) {
                // Delete the nested value
                delete currentContent[nestedTitle];
              } else {
                // If the nested content doesn't exist or it's not an object, break the loop
                if (!currentContent[nestedTitle] || typeof currentContent[nestedTitle] !== 'object') {
                  break;
                }

                currentContent = currentContent[nestedTitle];
              }
            }
          } else {
            // Delete the entire entry
            jsonData.splice(entryIndex, 1);
          }
        }

        // Write the updated JSON data back to the file
        writeFileSync(path, JSON.stringify(jsonData, null, 2), 'utf8');
      } else {
        console.log('File path is missing from Delete JSON Data action!');
      }
    } catch (err) {
      console.error(`ERROR! ${err.stack || err}`);
    }

    this.callNextAction(cache);
  },

  mod() {},
};