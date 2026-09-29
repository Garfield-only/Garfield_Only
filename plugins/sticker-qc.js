import { sticker } from '../lib/sticker.js'
import axios from 'axios'
import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, args, usedPrefix }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `😼 𓆩 𝗟𝗨𝗫 𝗫 𝗬𝗔𝗟𝗟𝗜𝗖𝗢 𓆪 🍕\n\n꒰ ◞⁺⊹ ．${fecha}\n`
    const footer = `\n━━━━━━━━━━━\n🍕 *LUX X YALLICO* 😼`
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;
    let authorName, text, pp;

    if (!args.length && !(m.quoted && m.quoted.text)) {
        return conn.sendMessage(m.chat, { text: head + `\n✍️ Ingresa un texto para tu sticker quotly.\n\n> Ejemplo: *${usedPrefix}qc Hola mundo*\n> Ejemplo: *${usedPrefix}qc @user Nombre / Hola*\n> Ejemplo: *${usedPrefix}qc Nombre / Hola*` + footer }, { quoted: m })
    }

    if (mentionedJid && args.join(" ").includes("/")) {
        const joined = args.slice(1).join(" ");
        const [authorNameRaw, ...textParts] = joined.split("/");
        authorName = authorNameRaw?.trim() || "Anónimo";
        text = textParts.join("/").trim();
        pp = await conn.profilePictureUrl(mentionedJid, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');
    }
    else if (!mentionedJid && args.join(" ").includes("/")) {
        const joined = args.join(" ");
        const [authorNameRaw, ...textParts] = joined.split("/");
        authorName = authorNameRaw?.trim() || "Anónimo";
        text = textParts.join("/").trim();
        pp = "https://files.catbox.moe/dpeqsr.jpg";
    }
    else if (!mentionedJid && args.length >= 1) {
        text = args.join(" ");
        try { authorName = await conn.getName(m.sender); } catch { authorName = "Anónimo"; }
        pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');
    }
    else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
        try { authorName = await conn.getName(m.sender); } catch { authorName = "Anónimo"; }
        pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');
    }
    else {
        return conn.sendMessage(m.chat, { text: head + `\n🐼 *Formato inválido.*\n\n> Usa: *${usedPrefix}qc Hola mundo*\n> Usa: *${usedPrefix}qc @user Nombre / Texto*` + footer }, { quoted: m })
    }

    if (!text) return conn.sendMessage(m.chat, { text: head + `\n🐼 Ingresa un texto para el sticker.` + footer }, { quoted: m })
    if (text.length > 30) return conn.sendMessage(m.chat, { text: head + `\n❌ Máximo 30 caracteres.` + footer }, { quoted: m })

    const obj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": "#000000",
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
            "entities": [],
            "avatar": true,
            "from": { "id": 1, "name": authorName || "Anónimo", "photo": { "url": pp } },
            "text": text,
            "replyMessage": {}
        }]
    };

    await react("⏳")

    try {
        const json = await axios.post('https://btzqc.betabotz.eu.org/generate', obj, {
            headers: { 'Content-Type': 'application/json' }
        });
        const buffer = Buffer.from(json.data.result.image, 'base64');
        const stiker = await sticker(buffer, false, global.stickpack, global.stickauth);
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'Quotely.webp', '', m);
            await react("✅")
        } else {
            await react("❌")
        }
    } catch (e) {
        console.error(e);
        await react("❌")
        await conn.sendMessage(m.chat, { text: head + `\n❌ Error al generar el sticker. Intenta de nuevo.` + footer }, { quoted: m })
    }
}

handler.help = ['qc']
handler.tags = ['sticker']
handler.command = ['quotly', 'qc']

export default handler