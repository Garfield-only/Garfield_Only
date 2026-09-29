import { sticker } from '../lib/sticker.js'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, usedPrefix, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `😼 𓆩 𝗟𝗨𝗫 𝗫 𝗬𝗔𝗟𝗟𝗜𝗖𝗢 𓆪 🍕\n\n꒰ ◞⁺⊹ ．${fecha}\n`
    const footer = `\n━━━━━━━━━━━\n🍕 *LUX X YALLICO* 😼`

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/webp|image|video/g.test(mime)) {
        try { await m.react('❌') } catch {}
        return conn.sendMessage(m.chat, { text: head + `\n❌ Responde a una imagen, video o gif para convertirlo en sticker con *${usedPrefix + command}*` + footer }, { quoted: m })
    }

    try { await m.react('⏳') } catch {}
    let img = await q.download()
    let stiker = await sticker(img, false, 'Lux Bot', 'Yallico')
    try { await m.react('✅') } catch {}
    await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
}
handler.help = ['s']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']
export default handler