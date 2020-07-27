import { wait } from './../utils/assist'
import { message } from './../config/message'
import { MessageOptions } from './../types/config'
import { Botkit, BotWorker, BotkitMessage } from 'botkit'

export const hears = (controller: Botkit) => {
    for (let i = 0, len = message.length; i < len; i++) {
        if (!message[i].monitor || message[i].isInterrupt) { continue }
        controller.hears(async (msg: BotkitMessage) => msg.text && msg.text.toLowerCase() === message[i].monitor ? true : false, message[i].event, async (bot: BotWorker, msg: BotkitMessage) => {
            let resp: string | Partial<BotkitMessage> = ''
            if (message[i].reply instanceof Array) {
                for (let j = 0, jLen = message[i].reply.length; j < jLen; j++) {
                    resp = { text: message[i].reply[j] }
                    if (j === jLen - 1 && message[i].options) { resp.options = message[i].options as MessageOptions[] }
                    await wait(j * 500)
                    await bot.reply(msg, resp)
                }
            } else {
                resp = { text: (message[i].reply as string) }
                if (message[i].options) { (resp as Partial<BotkitMessage>).options = message[i].options as MessageOptions[] }
                await bot.reply(msg, resp)
            }
        })
    }
}