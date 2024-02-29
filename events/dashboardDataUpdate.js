module.exports = {
  name: "DBM Dashboard Data Changed",
  isEvent: true,

  fields: ["Interaction (Temporary Variable Name)"],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;

    const waitForNextCheck = (events, currentIndex, data) => {
      if (currentIndex < events.length - 1) {
        setTimeout(() => {
          checkDashboardData(events, currentIndex + 1, data);
        }, 30000);
      }
    };

    const checkDashboardData = (events, currentIndex, data) => {
      const event = events[currentIndex];
      const temp = {};
      if (event.temp) temp[event.temp] = data;

      Actions.invokeEvent(event, null, temp, (result) => {
        if (result) {
          waitForNextCheck(events, currentIndex, data);
        }
      });
    };

    DBM.Events.dbmDashboardDataUpdate = function dbmDashboardDataUpdate(data) {
      if (!Bot.$evts["DBM Dashboard Data Changed"]) return;

      const events = Bot.$evts["DBM Dashboard Data Changed"];
      checkDashboardData(events, 0, data);
    };
  },
};
