import { wait } from './../utils/assist'
import { message } from './../config/message'
import { MessageOptions } from './../types/config'
import { Botkit, BotWorker, BotkitMessage } from 'botkit'


export const echo = (controller: Botkit) => {
    for (let i = 0, len = message.length; i < len; i++) {

        if (message[i].monitor || message[i].isInterrupt) { continue }

        controller.on(message[i].event, async (bot: BotWorker, msg: BotkitMessage) => {
            let resultReply: string | Partial<BotkitMessage> = ''

            if (message[i].reply instanceof Array) {
                for (let n = 0; n < message[i].reply.length; n++) {
                    resultReply = { text: message[i].reply[n] }
                    if (n === message[i].reply.length - 1 && message[i].options) { resultReply.options = message[i].options as MessageOptions[] }
                    await wait(n * 500)
                    await bot.reply(msg, resultReply)
                }
            } else {
                resultReply = { text: message[i].reply as string }
                if (message[i].options) { (resultReply as Partial<BotkitMessage>).options = message[i].options as MessageOptions[] }
                await bot.reply(msg, resultReply)
            }
        })
    }

    controller.on(['message', 'direct_message'], async (bot: BotWorker, msg: BotkitMessage) => {
        await bot.reply(msg, '暂未实现其他功能，留待后续....')
    })
}