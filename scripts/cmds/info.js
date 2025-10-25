const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
  config: {
    name: "owner",
    aliases: ["info", "profile"],
    author: "Piw piw",
    role: 0,
    shortDescription: "Show owner's profile",
    longDescription: "Shows a short personal profile of the owner.",
    category: "profile",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

    const profile = `
『 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 』

• Name: Gojo x Zenitsu ⚡  
• Class: Secret  
• Group: secret  
• Gender: Male  
• DOB: 17-12-2003 
• Religion: muslim  
• Blood: x  
• Height: 5.5 ft  
• Location: Dhaka  
• Hobby: Flirting  
• Status: Single  
• FB: fb.com/share/61580336378735/  
• IG: instagram.com/gojosaturo  
• Email: piwpiw@gmail.com  

⏰ Time: ${time}`;

    api.sendMessage(profile, event.threadID, (err, info) => {
      if (err) return console.error(err);
      setTimeout(() => {
        api.unsendMessage(info.messageID);
      }, 20000); // 20 seconds = 20000 ms
    });
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
