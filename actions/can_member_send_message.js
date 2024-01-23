module.exports = {
  name: 'Check If Member Can Send Message',
  section: 'Raikin Mods',
  meta: {
    version: '2.1.7',
    author: 'Raiin',
  },

  subtitle(data, presets) {
    const memberInfo = presets.getMemberText(data.member, data.varName);
    const channelInfo = presets.getChannelText(data.channel, data.varName2);
    return `${memberInfo} can send a message in ${channelInfo}?`;
  },

  fields: ['member', 'varName', 'channel', 'varName2', 'branch'],

  html(isEvent, data) {
    return `
<member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
<br><br><br>

<channel-input dropdownLabel="Channel" selectId="channel" variableContainerId="varNameContainer2" variableInputId="varName2"></channel-input>
<br><br><br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const member = await this.getMemberFromData(data.member, data.varName, cache);
    const channel = await this.getChannelFromData(data.channel, data.varName2, cache);

    if (!member || !channel) {
      console.error('You need to provide a valid member and channel for the "Check If Member Can Send Message" action.');
      return this.callNextAction(cache);
    }

    const result = channel.permissionsFor(member)?.has('SEND_MESSAGES') && channel.permissionsFor(member)?.has('VIEW_CHANNEL') || false;

    this.executeResults(result, data.branch, cache);
  },

  mod() {},
};