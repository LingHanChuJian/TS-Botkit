export type ImportsFunc = (...arg: any[]) => any

export type RulesFunc = (filePath: string) => boolean

export interface ImportsConfig {
    directoryPath: string
    importRules?: RegExp
    excludeRules?: RegExp | RulesFunc
    resolve?: ImportsFunc
    map?: ImportsFunc
}

export type ImportsOptions = string | ImportsConfig

export interface BaseObject {
    [key: string]: any
}
