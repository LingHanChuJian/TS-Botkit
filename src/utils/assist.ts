import fs from 'fs'
import path from 'path'
import { ImportsOptions, RulesFunc, ImportsConfig, BaseObject, ImportsFunc } from './../types/utils'

export const imports = async (options: ImportsOptions): Promise<BaseObject> => {
    const directoryPath: string = typeof options === 'string' ? options : options.directoryPath
    const importsRules: RegExp | RulesFunc = typeof options !== 'string' && options.importRules ? options.importRules : /^([^\.].*)\.(ts|json|js)?$/
    const excludeRules: RegExp | RulesFunc = typeof options !== 'string' && options.excludeRules ? options.excludeRules : /^\./
    const resolve: ImportsFunc = typeof options !== 'string' && options.resolve ? options.resolve : (value: any) => value 
    const map: ImportsFunc = typeof options !== 'string' && options.map ? options.map : (value: any, path: string) => value

    const modules: BaseObject = {}
    const files: string[] = fs.readdirSync(directoryPath)

    for (let i = 0, len = files.length; i < len; i++) {
        if((typeof excludeRules === 'function' && excludeRules(files[i])) || (typeof excludeRules === 'object' && excludeRules.test(files[i]))) { continue }
        const filePath: string = path.join(directoryPath, files[i])
        if (fs.statSync(filePath).isDirectory()) {
            const subOptions: ImportsOptions = typeof options === 'string' ? filePath : Object.assign({}, options)
            if (typeof options !== 'string') { (subOptions as ImportsConfig).directoryPath = filePath }
            const subModules: BaseObject = await imports(subOptions)
            if (Object.keys(subModules).length === 0) { continue }
            modules[map(files[i], filePath)] = subModules
        } else {
            const name: string | boolean = handleImportRules(importsRules, files[i])
            if (!name) { continue }
            const importsData: any = resolve(await import(filePath))
            modules[map(name, filePath)] = importsData
        }
    }
    return modules
}

export const handleImportRules = (importRules: RegExp | RulesFunc, fileName: string): string | boolean => {
    if (typeof importRules === 'function') { return importRules(fileName) }
    const match = fileName.match(importRules)
    if (!match) { return false }
    return match[1] || match[0]
}

export const typeOf = (value: any): string => {
    const toString: () => string = Object.prototype.toString
    const map: BaseObject = {
        '[object Boolean]'  : 'boolean',
        '[object Number]'   : 'number',
        '[object String]'   : 'string',
        '[object Function]' : 'function',
        '[object Array]'    : 'array',
        '[object Date]'     : 'date',
        '[object RegExp]'   : 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null',
        '[object Object]'   : 'object',
    }
    return map[toString.call(value)]
}

// 多层json处理成单层json
export const handleManyJson = (value: BaseObject): BaseObject => {
    const modules: BaseObject = {}
    for (const item in value) {
        if (typeOf(value[item]) === 'object') {
            const subModules: BaseObject = handleManyJson(value[item])
            for (let subItem in subModules) {
                modules[`${item}.${subItem}`] = subModules[subItem]
            }
        } else {
            modules[item] = value[item]
        }
    }
    return modules
}