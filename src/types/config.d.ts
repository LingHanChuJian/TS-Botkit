export interface MessageOptions {
    title: string
    payload: string
}

export interface Message {
    monitor?: string
    reply: string | string[]
    event: string[]
    options?: MessageOptions[]
    isInterrupt?: boolean
}