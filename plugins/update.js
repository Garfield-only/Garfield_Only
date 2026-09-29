import { exec } from "child_process"
import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = '51927174369'
    const head = `😼 𓆩 𝗟𝗨𝗫 𝗫 𝗬𝗔𝗟𝗟𝗜𝗖𝗢 𓆪 🍕\n\n꒰ ◞⁺⊹ ．${fecha}\n`
    const footer = `\n━━━━━━━━━━━\n🍕 *LUX X YALLICO* 😼\n👑 @${ownerNum}`

    try { await m.react('🌀') } catch {}

    exec('git pull', async (err, stdout) => {
        let text
        if (err) {
            try { await m.react('❌') } catch {}
            text = head + `\n❌ *ERROR*\n\`\`\`${err.message}\`\`\`` + footer
        } else if (stdout.includes('Already up to date.')) {
            try { await m.react('✅') } catch {}
            text = head + `\n✅ *Sin cambios*\nYa estás en la última versión.` + footer
        } else {
            try { await m.react('✅') } catch {}
            text = head + `\n✅ *Actualizado*\n\`\`\`${stdout.slice(0,1200)}\`\`\`` + footer
        }
        await conn.sendMessage(m.chat, { text, mentions: [ownerNum+'@s.whatsapp.net'] }, { quoted: m })
    })
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = /^(update|actualizar|fix)$/i
handler.rowner = true
export default handler