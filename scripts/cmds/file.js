const fs = require('fs');

module.exports = {
	config: {
		name: "file",
		aliases: ["files", "sendfile"],
		version: "1.0",
		author: "Amit Max ⚡",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send bot specified file ",
		category: "𝗢𝗪𝗡𝗘𝗥",
		guide: "{pn} file name. Ex: .{pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {
		const permission = ["100088513497761"];
		if (!permission.includes(event.senderID)) {
			return api.sendMessage("খানকির ছেলে আর একবার File চালি তোর গুষ্টি চুদে দিব 😡..", event.threadID, event.messageID);
		}

		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("File এর নাম লেখো জান 😘.", event.threadID, event.messageID);
		}

		const filePath = __dirname + `/${fileName}.js`;
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`খানকির ছেলে, এই File তোর কি আছে 😏: ${fileName}.js`, event.threadID, event.messageID);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');
		api.sendMessage({ body: fileContent }, event.threadID);
	}
};
