import { message } from './../config/message'
import { wait } from './../utils/assist'
import { Botkit, BotWorker, BotkitMessage } from 'botkit'

export const interrupts = (controller: Botkit) => {
    for (let i = 0, len = message.length; i < len; i++) {

        if (!message[i].isInterrupt) { continue }

        controller.interrupts(message[i].monitor instanceof Array ? async (msg: BotkitMessage) => {
            if (!msg.text) { return false }
            return (message[i].monitor as Array<string | RegExp>).some((item) => item instanceof RegExp ? item.test(msg.text as string) : (msg.text as string).toLowerCase() === item)
        } : (message[i].monitor as string | RegExp), message[i].event, async (bot: BotWorker, msg: BotkitMessage) => {
            let resultReply: string | Partial<BotkitMessage> = ''

            if (message[i].reply instanceof Array) {
                for (let j = 0; j < message[i].reply.length; j++) {
                    resultReply = { text: message[i].reply[j] }
                    await wait(j * 500)
                    await bot.reply(msg, resultReply)
                }
            } else {
                resultReply = { text: message[i].reply as string }
                await bot.reply(msg, resultReply)
            }
        })
    }
}