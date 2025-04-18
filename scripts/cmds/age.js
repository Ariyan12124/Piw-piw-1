/**
 * Script Name: age.js
 * মূল লেখক: Mahmud X
 * ক্ষ্যাপা সংস্করণে রিমিক্স করেছে: Amit Max ⚡
 * 
 * বিবরণ: জন্ম তারিখ দিয়ে তোর বয়স কত হইছে তা হিসাব করে, সাথে ক্ষ্যাপামোও বোনাসে!
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "age",
    aliases: [],
    version: "1.0",
    author: "Mahmud X & Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "তোর বয়স কতো হইছে বুঝিস?"
    },
    longDescription: {
      en: "তোদের জন্মদিন গুনে গুনে বলবো কতো পুরান হইছস!"
    },
    category: "utility",
    guide: {
      en: "{pn} [YYYY-MM-DD] — জন্ম তারিখটা দিবি, না হলে ঝাড় খাবি!"
    }
  },

  onStart: async function ({ api, event, args }) {
    const input = args.join(" ");

    if (!input) {
      return api.sendMessage("ওই লুচ্চা! আগে তোর জন্ম তারিখ দে — YYYY-MM-DD ফরম্যাটে, বুঝলি?!", event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(`https://api.popcat.xyz/age?dob=${input}`);
      const data = response.data;

      const message = 
`📅 জন্মদিনের খতিয়ান (Mahmud X & Amit Max ⚡ রে ধন্যবাদ দিস!)

🔞 তুই হইছসঃ ${data.age} বছর ধরের ভীমরতি
📆 জন্ম তারিখঃ ${data.date}

⏰ জন্মের পর তুই বুড়া হইছস এইটুকুঃ
    • দিন পার হইছে: ${data.days_old} টা দিন!
    • সপ্তাহ হইছে: ${data.weeks_old} টা সপ্তাহ
    • মাস গুনছস: ${data.months_old} টা মাস
    • ঘণ্টা গুইলছস: ${data.hours_old} ঘণ্টা
    • মিনিট পার হইছে: ${data.minutes_old} মিনিট

সব হিসাব দিলাম, এখন তুই চাইলে কাইন্দা নিস!`;

      return api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error("API ফাটায় দিছে:", error);
      return api.sendMessage("ধুর বেটা, ঠিকমতো জন্ম তারিখ লিখ না! আবার আসিস!", event.threadID, event.messageID);
    }
  }
};
