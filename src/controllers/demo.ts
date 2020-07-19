import { imports } from "utils/assist";

import path from 'path'
import { Botkit } from 'botkit'

export const demo =(controller: Botkit) => {

    // make public/index.html available as localhost/index.html
    // by making the /public folder a static/public asset
    controller.publicFolder('/', path.join(__dirname, 'public'))

    console.log('Chat with me: http://localhost:' + (process.env.PORT || 3000))
}
