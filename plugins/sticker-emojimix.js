import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `😼 𓆩 𝗟𝗨𝗫 𝗫 𝗬𝗔𝗟𝗟𝗜𝗖𝗢 𓆪 🍕\n\n꒰ ◞⁺⊹ ．${fecha}\n`
    const footer = `\n━━━━━━━━━━━\n🍕 *LUX X YALLICO* 😼`

    let [emoji1, emoji2] = text.split(/[&+\s]+/)
    if (!emoji1 || !emoji2) return conn.sendMessage(m.chat, { text: head + `\n⤷ Uso correcto: *${usedPrefix + command} emoji1+emoji2*\n> Ejemplo: *${usedPrefix + command} 😃+🔥*` + footer }, { quoted: m })

    let url = `https://api.evogb.org/tools/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}&key=Russellxz`

    try {
        try { await m.react('⏳') } catch {}
        await conn.sendMessage(m.chat, { sticker: { url: url } }, { quoted: m })
        try { await m.react('✅') } catch {}
    } catch (e) {
        try { await m.react('❌') } catch {}
        await conn.sendMessage(m.chat, { text: head + `\n❌ Error al generar el sticker.` + footer }, { quoted: m })
    }
}

handler.help = ['emojimix <emoji1>+<emoji2>']
handler.tags = ['fun']
handler.command = ['emojimix', 'mix']

export default handler