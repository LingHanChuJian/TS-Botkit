import { wait } from './../utils/assist'
import { message } from './../config/message'
import { MessageOptions } from './../types/config'
import { Botkit, BotWorker, BotkitMessage } from 'botkit'

export const hears = (controller: Botkit) => {
    for (let i = 0, len = message.length; i < len; i++) {

        if (!message[i].monitor || message[i].isInterrupt) { continue }

        controller.hears(message[i].monitor instanceof Array ? message[i].monitor as Array<string | RegExp> : async (msg: BotkitMessage) => {
            if (!msg.text) { return false }
            return message[i].monitor instanceof RegExp ? (message[i].monitor as RegExp).test(msg.text) : msg.text.toLowerCase() === message[i].monitor as string
        }, message[i].event, async (bot: BotWorker, msg: BotkitMessage) => {
            let resultReply: string | Partial<BotkitMessage> = ''
            if (message[i].reply instanceof Array) {
                for (let j = 0; j < message[i].reply.length; j++) {
                    resultReply = { text: message[i].reply[j] }
                    if (j === message[i].reply.length - 1 && message[i].options) { resultReply.options = message[i].options as MessageOptions[] }
                    await wait(j * 500)
                    await bot.reply(msg, resultReply)
                }
            } else {
                resultReply = { text: (message[i].reply as string) }
                if (message[i].options) { (resultReply as Partial<BotkitMessage>).options = message[i].options as MessageOptions[] }
                await bot.reply(msg, resultReply)
            }
        })
    }
}