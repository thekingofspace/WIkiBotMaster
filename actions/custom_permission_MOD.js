const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Control Permission',
  section: 'Custom Permission',
  fields: ['server', 'permissionName', 'permissionType', 'permissionAddType', 'objectVariable'],
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_file_info_MOD.js',
  },

  html(isEvent, data) {
    return `<div><server-input dropdownLabel="Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input></div><br><br><br><br><div style="width: 48%;"><span class="dbminputlabel">Permission Name</span><br><input id="permissionName" class="round" type="text"></div><br><br><div style="display: flex; justify-content: space-between;"><div style="width: 48%;"><span class="dbminputlabel">Permission Type</span><br><select id="permissionType" class="round"><option value="inherit" selected>Inherit</option><option value="allow">Allow</option><option value="disallow">Disallow</option></select></div></div><br><br><div style="display: flex; justify-content: space-between;"><div style="width: 48%;"><span class="dbminputlabel">Object Variable</span><br><input id="objectVariable" class="round" type="text"></div><div style="width: 48%;"><span class="dbminputlabel">Permission Add Type</span><br><select id="permissionAddType" class="round"><option value="member" selected>Member</option><option value="role">Role</option></select></div></div>`;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = await this.getServerFromData(data.server, '', cache);
    const permissionName = this.evalMessage(data.permissionName, cache);
    const permissionType = data.permissionType;
    const permissionAddType = data.permissionAddType;
    const objectVariable = this.evalMessage(data.objectVariable, cache);

    if (!server) return this.callNextAction(cache);

    const botDirectory = process.cwd(); // Get the bot's current working directory
    const permissionFilePath = path.join(botDirectory, 'data', 'permission.json');

    try {
      // Read existing permission data or create an empty object if the file doesn't exist
      const permissionData = fs.existsSync(permissionFilePath)
        ? JSON.parse(fs.readFileSync(permissionFilePath, 'utf8'))
        : {};

      // Initialize the server's permission data if it doesn't exist
      permissionData[server.id] = permissionData[server.id] || {};

      // Update the permission data based on user inputs
      permissionData[server.id][permissionName] = {
        type: permissionType,
        addType: permissionAddType,
        objectVariable: objectVariable,
      };

      // Save the updated permission data
      fs.writeFileSync(permissionFilePath, JSON.stringify(permissionData, null, 2));

      this.callNextAction(cache);
    } catch (error) {
      console.error('Error while updating permission data:', error);
      this.callNextAction(cache);
    }
  },
};
