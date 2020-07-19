import { message } from './../config/message'
import { MessageOptions } from './../types/config'
import { Botkit, BotWorker, BotkitMessage } from 'botkit'


export const echo = (controller: Botkit) => {
    for (let i = 0, len = message.length; i < len; i++) {
        if (message[i].monitor || message[i].isInterrupt) { continue }
        controller.on(message[i].event, async (bot: BotWorker, msg: BotkitMessage) => {
            let resp: string | Partial<BotkitMessage> = ''
            if (message[i].reply instanceof Array) {
                for (let j = 0, jLen = message[i].reply.length; j < jLen; j++) {
                    resp = { text: message[i].reply[j] }
                    if (j === jLen - 1 && message[i].options) { resp.options = message[i].options as MessageOptions[] }
                    await bot.reply(msg, resp)
                }
            } else {
                resp = { text: (message[i].reply as string) }
                if (message[i].options) { (resp as Partial<BotkitMessage>).options = message[i].options as MessageOptions[] }
                await bot.reply(msg, resp)
            }
        })
    }

    controller.on(['message', 'direct_message'], async (bot: BotWorker, msg: BotkitMessage) => {
        await bot.reply(msg, '暂未实现其他功能，留待后续....')
    })
}