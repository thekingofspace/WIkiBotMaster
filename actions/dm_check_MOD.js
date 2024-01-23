module.exports = {
  name: 'Check DM',
  section: 'Raikin Mods',
  meta: {
    version: '2.1.7',
    author: 'Raiin',
  },

  subtitle(data, presets) {
    const memberInfo = presets.getMemberText(data.member, data.varName);
    return `Modify server settings for ${memberInfo}`;
  },

  fields: ['member', 'varName', 'branch'],

  html(isEvent, data) {
    return `
<member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
<br><br><br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const member = await this.getMemberFromData(data.member, data.varName, cache);

    if (!member) {
      console.error('You need to provide a valid member for the "ModifyServerSettings" action.');
      return this.callNextAction(cache);
    }

    try {
      const dmChannel = await member.createDM();

      // Check if the bot can send messages to the user
      const botCanSend = dmChannel.canSend || false;

      if (botCanSend) {
        // Proceed with modifying server settings or sending messages
        // ...

        // For example, sending a message
        await dmChannel.send('This is a test message to modify server settings.');

        // ...

        // Continue with the rest of the action
        this.callNextAction(cache);
      } else {
        console.error('Bot cannot send a message to the member.');
        // Handle the case where the bot cannot send messages to the user
        // ...

        // Set the result to false or handle the error accordingly
        this.executeResults(false, data.branch, cache);
      }
    } catch (error) {
      console.error('Error in ModifyServerSettings action:', error.message);
      // Handle other errors if needed
      // ...

      // Rethrow the error to propagate it further if necessary
      throw error;
    }
  },

  mod() {},
};