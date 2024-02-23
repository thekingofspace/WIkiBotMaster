module.exports = {
  name: "Exponential Backoff",

  section: "Other Stuff",

  subtitle(data, presets) {
    const measurements = ["Milliseconds", "Seconds", "Minutes", "Hours"];
    return `${data.time} ${measurements[parseInt(data.measurement, 10)]}`;
  },

  meta: { version: "1.0.1", author: "Your Name", authorUrl: "Your URL", downloadUrl: "Download URL" },

  fields: ["time", "measurement"],

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 45%;">
		<span class="dbminputlabel">Measurement</span><br>
		<select id="measurement" class="round">
			<option value="0">Milliseconds</option>
			<option value="1" selected>Seconds</option>
			<option value="2">Minutes</option>
			<option value="3">Hours</option>
		</select>
	</div>
	<div style="float: right; width: 50%;">
		<span class="dbminputlabel">Amount</span><br>
		<input id="time" class="round" type="text">
	</div>
</div>`;
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    let time = parseInt(this.evalMessage(data.time, cache), 10);
    const type = parseInt(data.measurement, 10);

    switch (type) {
      case 1:
        time *= 1000;
        break;
      case 2:
        time *= 1000 * 60;
        break;
      case 3:
        time *= 1000 * 60 * 60;
        break;
      default:
        return this.callNextAction(cache);
    }

    const maxRetries = 3;
    let retries = 0;

    const makeRequestWithRetries = async () => {
      try {
        // Replace this with your actual request logic
        // Example: const response = await makeRequest();
        console.log("Making request...");
        // Simulate success for demonstration purposes
        const response = { statusCode: 200 };
        // Process the response

        // If successful, break out of the loop
        console.log("Request successful");
        this.callNextAction(cache);
      } catch (error) {
        if (error.statusCode === 429 && retries < maxRetries) {
          // If rate-limited, implement exponential backoff
          const delay = Math.pow(2, retries) * 1000; // 2^retries seconds
          console.log(`Rate limited. Retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
          makeRequestWithRetries(); // Retry the request
        } else {
          // Handle other types of errors
          console.error("Error:", error);
          this.callNextAction(cache);
        }
      }
    };

    makeRequestWithRetries();
  },

  mod() {},
};
