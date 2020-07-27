const config = {
    wsUrl: (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host,
    reconnectTimeout: 3000,
    maxReconnect: 3,
    reconnectCount: 0
}

// 添加本地存储
const addStore = (key, value) => localStorage.setItem(key, value)

// 取出本地存储
const getStore = (key) => localStorage.getItem(key)

// 移除本地存储
const removeStore = (key) => localStorage.removeItem(key)


let UUID = getStore('botkit-uuid')

const randomCharacter = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

const uuid = () => {
    let botkitUUID = randomCharacter()
    for (let i = 0, len = 4; i < len; i++) {
        botkitUUID += `${randomCharacter()}-${randomCharacter()}`
    }
    botkitUUID += randomCharacter()
    addStore('botkit-uuid', botkitUUID)
    return botkitUUID
}

const connectWebsocket = () => {
    const socket = new WebSocket(config.wsUrl)

    let connectEvent = 'hello'
    if (UUID) {
        connectEvent = 'welcome_back'
    } else {
        UUID = uuid()
    }

    socket.addEventListener('open', (event) => {
        console.log('连接socket')
        config.reconnectCount = 0
        sendWebsocket(socket, {
            type: connectEvent,
            user: UUID,
            channel: 'socket',
            user_profile: null
        })
    })

    socket.addEventListener('message', (event) => {
        try {
            const message = JSON.parse(event.data)
            renderMessage(socket, message)
        } catch(e) {
            console.error(e)
        }
    })

    socket.addEventListener('error', (event) => {
        console.error('error', event)
    })


    socket.addEventListener('close', () => {
        console.log('关闭socket')
        if (config.reconnectCount < config.maxReconnect) {
            setTimeout(() => {
                console.log('尝试重新连接 socket', ++config.reconnectCount)
                connectWebsocket()
            }, config.reconnectTimeout)
        } else {
            console.log('达到最大尝试次数')
        }
    })
}

const sendWebsocket = (socket, message) => {
    socket.send(JSON.stringify(message))
}

const renderMessage = (socket, message) => {
    const messageContentDiv = document.createElement('div')
    messageContentDiv.className = 'message-content'
    const messageDiv = document.createElement('div')
    messageDiv.className = `conversation ${message.type}`
    messageDiv.innerHTML = message.text
    messageContentDiv.appendChild(messageDiv)
    document.querySelector('div.botkit-dialogue').appendChild(messageContentDiv)
    if (message.hasOwnProperty('options')) { renderOptions(socket, message.options) }
}

const renderOptions = (socket, options) => {
    removeOptions()

    const optionsUl = document.createElement('ul')
    for (let i = 0, len = options.length; i < len; i++) {
        const optionsLi = document.createElement('li')
        optionsLi.innerText = options[i].title
        optionsLi.addEventListener('click', () => {
            removeOptions()
            renderMessage(socket, { type: 'user-message', text: options[i].payload })
            sendWebsocket(socket, { type: 'message', text: options[i].payload, user: UUID, channel: 'socket' })
        })
        optionsUl.appendChild(optionsLi)
    }

    document.querySelector('div.botkit-options').appendChild(optionsUl)
}

const removeOptions = () => { document.querySelector('div.botkit-options').innerHTML = '' }

connectWebsocket()

            