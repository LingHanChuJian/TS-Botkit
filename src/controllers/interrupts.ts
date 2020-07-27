import { message } from './../config/message'
import { wait } from './../utils/assist'
import { Botkit, BotWorker, BotkitMessage } from 'botkit'

export const interrupts = (controller: Botkit) => {
    for (let i = 0, len = message.length; i < len; i++) {
        if (!message[i].isInterrupt) { continue }
        controller.interrupts(async () => message[i].monitor ? true : false, message[i].event, async (bot: BotWorker, msg: BotkitMessage) => {
            let resp: string | Partial<BotkitMessage> = ''
            if (message[i].reply instanceof Array) {
                for (let j = 0, jLen = message[i].reply.length; j < jLen; j++) {
                    resp = { text: message[i].reply[j] }
                    await wait(j * 500)
                    await bot.reply(msg, resp)
                }
            } else {
                resp = { text: (message[i].reply as string) }
                await bot.reply(msg, resp)
            }
        })
    }
}