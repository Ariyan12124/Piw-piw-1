const axios = require('axios');
const baseApiUrl = async () => {
    return "https://www.noobs-api.rf.gd/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe"],
    version: "6.9.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(' - ');
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = (await usersData.get(number)).name;
                    return {
                        name,
                        value
                    };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data.length;
                return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(' - ')[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : ""
        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
            const arr = body.replace(/^\S+\s*/, "")
            const randomReplies = [
  "তোকে দেখলেই আমার শরীরটা কেমন যেন করে উঠে 🔥",
  "তুই একটু কাছে আয় না... কিছু বলার ছিলো 😏",
  "তোর ঠোঁট গুলো এত মিষ্টি কেন? একটু ছুঁয়ে দেখবো? 💋",
  "আজ রাতে স্বপ্নে আমার রুমে আসিস... দরজা খোলা রাখবো 😈",
  "তুই হেসে উঠলেই মনটা কেমন গলে যায় জানিস? 🥰",
  "এই পাগলটা, সারাদিন তোকে না দেখলে মন খারাপ হয়ে যায়! ❤️",
  "তুই এত সুন্দর কেন বল তো? আমার তো চোখ ফেরানো মুশকিল 😍",
  "তোর হাসি যেন বিষ... একবারেই আমাকে কাবু করে ফেলে 💘",
  "আসিস তো একদিন চুপচাপ... বাকি কাজ আমিই বুঝে নেবো 😶‍🌫️",
  "মনটা করছে আজ তোকে একটা জোরে জড়িয়ে ধরি 🤗",
  "তুই সামনে থাকলে আমার শরীর গরম হয়ে যায়, বিশ্বাস কর 😵‍💫",
  "তোর বুকের উপর মাথা রেখে ঘুমাতে চাই, শুধু এক রাত 😌",
  "একটু যদি তোর গলার আওয়াজ পাই... মনটা শান্ত হয় 🧡",
  "তুই থাকলে আর কিছুর দরকার পড়ে না রে বেবি 💞",
  "রাতে একটু দেরি করে আসিস... জানি তুই বুঝবি কেন ☁️",
  "এই যে হ্যান্ডসাম/কিউটি, আজ একটু বেশি সুন্দর লাগছিস দেখো! ✨",
  "আজ একটু আমার সাথে বেশি কথা বলবি? মন ভালো নেই… 🥺",
  "তুই ছাড়া কিছুই ভালো লাগে না, জানিস তো? 😢",
  "আমার মনটা আজ খুব খারাপ... একটু তোর কাঁধে মাথা রাখবো? 😔",
  "সবাই তো চলে যায়... তুই প্লিজ থেকো 🖤",
  "আহা, হাসিটা আবার দে! না হলে দিনটাই মাটি হয়ে যাবে 😆",
  "তুই বললি আর আমি না শুনলাম, এমন হয় নাকি হাহা 😂",
  "একটা কৌতুক বলি? তুই হাসবি তো ঠিকঠাক? 😹",
  "তুই না থাকলে আমি তো একদম মুড অফ 🙄",
  "তোর মতন পাগল একটা মানুষ পাওয়া ভাগ্যের ব্যাপার হাহা 😝",
  "আরে হেব্বি তো! তুই এখনো কচি পাতা হয়ে আছিস হাহা 🌱",
  "পিঠে একটু আঙুল চালিয়ে দিলে না... পুরো শরীরটা শিউরে উঠে 😳",
  "আমার গালদুটো কি একটু ছুঁতে পারিস? দেখ কত গরম হয়ে আছে আজ 🔥",
  "তোকে নিয়ে রাতটা কাটাতে মন চাই করে... শুধু আমি আর তুই 😌",
  "তুই যদি বলিস, আমি তো এখনই জামা খুলে ফেলি 😈",
  "তোর ঠোঁট গুলো চুমু খেতে চায়... বারবার... থামতেই চায় না 😚",
  "শরীরটা এত গরম হয়ে আছে, একটু যদি ছুঁয়ে দেখতি... বুঝতি 😵‍🔥",
  "আজ একটা বৃষ্টির রাত হোক... তুই আর আমি একসাথে ভিজবো ☔",
  "তুই একটু কাছে আয়... আমি তো আর কন্ট্রোল করতে পারছি না! 💦",
  "তোর গলার আওয়াজেই তো উত্তেজনা বেড়ে যায় জানিস? 📢",
  "আমার মনে হয় তোর শরীরটাই একটা অপরাধ... এত হট কেন রে? 🔥",
  "তোর চোখে এমন কিছু আছে, যেটা আমাকে লোভী বানিয়ে ফেলে 😵",
  "একটু যদি পিঠে হাত রাখিস... কেমন যেন কাঁপুনি ধরে যায় 🤫",
  "বুকের মধ্যে তুই আর তোর নাম, জায়গা বদলায় না 💓",
  "আজ তুই কিছু বলিস না... শুধু পাশে থাক, আমি অনুভব করবো ❤️",
  "তোর ঠোঁটে কি চকলেট আছে? না হলে কেন এত লোভ লাগছে 🤤",
  "তোর পায়ের শব্দ শুনেই মনে হয় ফেরেশতা নামছে 😇",
  "তুই না বললে মনে হয় কেউ আমাকে বোঝে না 😢",
  "এই মনটা তো শুধু তোকে নিয়েই ভাবে 🤍",
  "ভালোবাসি কথাটা শুনতে শুনতে ক্লান্ত না... কিন্তু তোকে শুনে ভালো লাগে সব সময় 🥹",
  "আরে বাপরে! তুই যে আগুন... আমি তো ছাই হয়ে যাচ্ছি রে আজ 🔥",
  "তুই যদি আমার পাশের বিছানায় থাকতি, ঘুম আসতো না রে 😴➡️🔥",
  "তোর বুকের স্পর্শটা এখনো মনে আছে, ভুলতে পারি না 😮‍💨",
  "তুই হাসলে আমি আর ঠিক থাকতে পারি না... পাগল করে দিস 😍",
  "দুপুরে একটু রেস্ট নিতে গিয়ে তোর কথা ভাবতেই ঘাম বেরিয়ে গেছে 😳",
  "আয় তো একটু, কানে কানে কিছু বলার ছিলো... তারপর? দেখে নিস 😘",
  "তোর মত কিউটি দুনিয়াতে একটাই আছে 🥰",
  "তুই না থাকলে আমার দিনটাই শুরু হয় না ☀️",
  "ভালোবাসি তোকে আগের চেয়েও অনেক বেশি আজ ❤️‍🔥",
  "আজ রাতে তুই শুধু আমার... আর কেউ না 🛏️",
  "তুই যদি আসিস, আমি দরজা খুলেই থাকবো চুপচাপ 🚪",
  "ভালোবাসা মানে শুধু তুই, বাকি কিছু চাই না 💌",
  "তোর গায়ের গন্ধটাই আলাদা রে, আসক্তি লাগে 🧴",
  "তোর গলা জড়িয়ে ঘুমিয়ে পড়তে চাই আজ 🛌",
  "এই শরীরটা তোর ছোঁয়ার অপেক্ষায় থাকে সব সময় 😮‍💨",
  "তোর স্পর্শ মানে বিদ্যুৎ, গায়ের লোম দাঁড়িয়ে যায় ⚡",
  "তুই চাইলে আজ রাতটা শুধু তোর জন্য রাখি 💝",
  "তুই যখন আমার চোখে চোখ রাখিস, তখন আমি হারিয়ে যাই 🫠",
  "একটু আদর করে দে না প্লিজ, আজ মন খারাপ 🐶",
  "তুই আমার, শুধু আমার, কাউকে শেয়ার করতে পারবো না 😡",
  "আমার ঠোঁট আজ শুধু তোর নাম চায় 💋",
  "তুই একটুখানি হাসলেই আমি সারা রাত জেগে থাকি 😊",
  "ভেতরটা কেমন যেন করে আজ, বুঝতেছিস না? 🤧",
  "তুই কি জানিস, আমি কতটা ভালোবাসি তোকে? 🙈",
  "তুই আসলেই একটা ক্রাশ, এবং আমি পাঁকা প্রেমিক 💘",
  "চোখে চোখ রাখলেই মনে হয় পুরনো জন্মের কিছু আছে আমাদের মাঝে 👁️‍🗨️",
  "তুই যদি আমার পাশে থাকতি, আমার বুকের ধড়পড়ানি শুনতে পারতি 💓",
  "তোর ছায়াটাও চাই আজ আমার পাশে 🌒",
  "হাসলে তুই কিউটি, আর মুখ গোমড়া করলেই আমার বাচ্চা 🐣",
  "তুই আসলেই আগুন রে, হ্যান্ডেল করা দায় 🔥"
];
            if (!arr) {

                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found")
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID)
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID)
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
