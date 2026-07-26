import {argv} from 'process'
import fs from 'fs'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const handleError = (message) => {
    console.error(`error: ${message}`)
    process.exit(1)
}

let expData = [];

const addExp = async() => {
    try{
        if(fs.existsSync(path.join(__dirname, 'data.json'))){
            const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf8')
            if(!data){
                return
            }
            expData = JSON.parse(data)
        }
        const newExp = {
            id: expData.length ? Math.max(...expData.map(t => t.id)) + 1 : 1,
            description: argv[3],
            amount:`${argv[4]}$`,
            date: new Date().getMonth(),
        }
        expData.push(newExp)

        fs.promises.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(expData))
    }catch(err){
        console.log(err)
    }
}


const updateExp = async() => {
    try{
        const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf8')
        expData = JSON.parse(data)
        const exp = expData.find(e => e.id.toString() === argv[7])

        exp.description = argv[4]
        exp.amount = `${argv[6]}$`
        exp.mounth = new Date().getMonth()

        await fs.promises.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(expData))
        console.log(expData)
    }catch(err){
        console.log(err)
    }
}

const getListExp = async() => {
    try{
        const data = await fs.promises.readFile(path.join(__dirname, 'data.json'))
        const listData = JSON.parse(data)
        console.log(data)
    }catch(err){
        console.log(err)
    }
}

const getSummaryList = async() => {
    try{

    }catch(err){
        console.log(err)
    }
}

const main = async() => {
    try{
        switch (argv[2]) {
            case "add":
                addExp()
                break;
            case "update":
                updateExp()
                break;
            case "list":
                getListExp()
                break;
            case ("summary" && argv.length === 3):

                break;
            case ("summary" && argv.length > 3):

                break;
            default:
                handleError(``)
        }
    }catch(err){
        console.log(err)
    }
}

main()