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

let socket = null

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
    socket = new WebSocket(config.wsUrl)

    let connectEvent = 'hello'
    if (UUID) {
        connectEvent = 'welcome_back'
    } else {
        UUID = uuid()
    }

    socket.addEventListener('open', (event) => {
        console.log('连接socket')
        config.reconnectCount = 0
        sendWebsocket({
            type: connectEvent,
            user: UUID,
            channel: 'socket',
            user_profile: null
        })
    })

    socket.addEventListener('message', (event) => {
        try {
            const message = JSON.parse(event.data)
            renderMessage(message)
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

const sendWebsocket = (message) => {
    if (socket) { socket.send(JSON.stringify(message)) }
}

const renderMessage = (message) => {
    const messageContentDiv = document.createElement('div')
    messageContentDiv.className = `message-content ${message.type}`
    const messageDiv = document.createElement('div')
    messageDiv.className = `conversation`
    messageDiv.innerHTML = message.text
    messageContentDiv.appendChild(messageDiv)
    document.querySelector('div.botkit-dialogue').appendChild(messageContentDiv)
    if (message.hasOwnProperty('options')) { renderOptions(message.options) }
}

const renderOptions = (options) => {
    removeOptions()

    for (let i = 0, len = options.length; i < len; i++) {
        const optionsButton = document.createElement('button')
        optionsButton.innerHTML = options[i].title
        optionsButton.addEventListener('click', () => {
            removeOptions()
            renderMessage({ type: 'user-message', text: options[i].title })
            setTimeout(() => sendWebsocket({ type: 'message', text: options[i].payload, user: UUID, channel: 'socket' }), 500)
        })
        document.querySelector('div.botkit-options').appendChild(optionsButton)
    }

}

const removeOptions = () => { document.querySelector('div.botkit-options').innerHTML = '' }

connectWebsocket()

document.querySelector('.input-group-append').addEventListener('click', () => {
    const text = document.querySelector('.input').value
    if (!text) { return }
    removeOptions()
    renderMessage({ type: 'user-message', text })
    sendWebsocket({
        type: 'message',
        text,
        user: UUID,
    })
    document.querySelector('.input').value = ''
})