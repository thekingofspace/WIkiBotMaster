module.exports = {
    name: 'Check Voice Channel Size',
    section: 'Channel Control',
    meta: {
        version: '2.1.7',
        preciseCheck: false,
        author: 'Raikin',
    },

    subtitle(data, presets) {
        return presets.getConditionsText(data);
    },

    fields: ["channel", "varName", "comparison", "count", "branch"],

    html(isEvent, data) {
        return `
    <div>
        <p>
            <u>Mod Info:</u><br>
            Created by Raiin
        </p>
    </div>
    <br>
    <div>
        <voice-channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></voice-channel-input>
    </div>
    <br><br><br>
    <div style="float: left; width: 50%;">
        <span class="dbminputlabel">Comparison Type</span><br>
        <select id="comparison" class="round">
            <option value="0">Equals</option>
            <option value="1">Above</option>
            <option value="2">Below</option>
        </select>
    </div>
    <div style="float: right; width: 30%;">
        <span class="dbminputlabel">Member Count</span><br>
        <input id="count" class="round" type="text">
    </div>
    <br><br><br>
    <div>
        <conditional-input id="branch"></conditional-input>
    </div>`;
    },

    init() { },

    action(cache) {
        const data = cache.actions[cache.index];
        const channel = this.getVoiceChannelFromData(data.channel, data.varName, cache);

        const comparison = parseInt(data.comparison, 10);
        const count = parseInt(this.evalMessage(data.count, cache));

        let result = false;
        if (channel && channel.type === "voice" && !isNaN(count)) {
            switch (comparison) {
                case 0: // Equals
                    result = channel.members.size === count;
                    break;
                case 1: // Above
                    result = channel.members.size > count;
                    break;
                case 2: // Below
                    result = channel.members.size < count;
                    break;
                default:
                    break;
            }
        }

        this.executeResults(result, data?.branch ?? data, cache);
    },

    modInit(data) {
        this.prepareActions(data.branch?.iftrueActions);
        this.prepareActions(data.branch?.iffalseActions);
    },

    mod() { },
};