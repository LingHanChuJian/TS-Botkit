import path from 'path'
import { BaseObject } from './types/utils'
import { BotkitCMSHelper } from 'botkit-plugin-cms'
import { WebAdapter } from 'botbuilder-adapter-web'
import { imports, handleManyJson } from './utils/assist'
import { MongoDbStorage } from 'botbuilder-storage-mongodb'
import { Botkit, BotkitConfiguration, BotWorker, BotkitMessage } from 'botkit'

require('dotenv').config()

let storage: MongoDbStorage | undefined = undefined
if (process.env.MONGO_URI) {
    storage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    })
}

const adapter: WebAdapter = new WebAdapter({})

const botkitOptions: BotkitConfiguration = {
    webhook_uri: '/api/messages',
    adapter,
}

if (storage) { botkitOptions.storage = storage }

const controller: Botkit = new Botkit(botkitOptions)

if (process.env.cms_uri) {
    controller.usePlugin(new BotkitCMSHelper({
        uri: process.env.cms_uri,
        token: (process.env.cms_token as string),
    }))
}

controller.ready(async () => {

    const modules: BaseObject = await imports(path.join(__dirname, 'controllers'))

    const handleModules: BaseObject = handleManyJson(modules)

    for (let controllerKey in handleModules) {
        handleModules[controllerKey](controller)
    }

    if (controller.plugins.cms) {
        controller.on('message,direct_message', async (bot: BotWorker, message: BotkitMessage) => {
            let results: Boolean = await controller.plugins.cms.testTrigger(bot, message)
            if (results) { return false }
        })
    }
})
