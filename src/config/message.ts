import marked from 'marked'
import { Message } from './../types/config'

const message: Message[] = [
    {
        reply: ['Hi,Wanderer!', '我是凌寒初见', '我就是一个死宅 !!'],
        event: ['hello'],
        options: [
            {
                title: '然后呢?',
                payload: '然后呢?',
            },
            {
                title: '少废话',
                payload: '少废话',
            }
        ]
    },
    {
        reply: ['欢迎回来!', '有什么需要了解的么?'],
        event: ['welcome_back'],
        options: [
            {
                title: '关于我',
                payload: '关于我',
            }
        ]
    },
    {
        monitor: '关于我',
        reply: ['我是凌寒初见', '我就是一个死宅!!'],
        event: ['message', 'direct_message'],
        options: [
            {
                title: '然后呢?',
                payload: '然后呢?',
            },
            {
                title: '少废话',
                payload: '少废话',
            }
        ]
    },
    {
        monitor: '然后呢?',
        reply: ['我会一点点JavaScript、python、vue、electron', '喜欢动漫、沉迷Galgame、梦想去一趟日本', '然后得过且过', '人生远不止眼前的苟且'],
        event: ['message', 'direct_message'],
        options: [
            {
                title: '为啥取名叫凌寒初见?',
                payload: '为啥取名叫凌寒初见?',
            }
        ]
    },
    {
        monitor: '少废话',
        reply: '告辞',
        event: ['message', 'direct_message'],
        isInterrupt: true,
    },
    {
        monitor: '为啥取名叫凌寒初见?',
        reply: ['这个名字对我来说有很重要的意义(笑)', '但是如果你从哪里看见这个名字，那么不用怀疑就是我(假)', '那么请仔细研究下我的blog吧!'],
        event: ['message', 'direct_message'],
    }
]

for (let i = 0, len = message.length; i < len; i++) {
    message[i].reply = message[i].reply instanceof Array ? (message[i].reply as string[]).map((item) => marked(item)) : marked((message[i].reply as string))
}

export {
    message,
}
