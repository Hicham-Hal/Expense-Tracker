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

const getFlagValue = (flagName) => {
    const index = argv.indexOf(flagName)
    if(index === -1){
        // handleError(`flag name should be correct: ${flagName}`)
        return
    };
    return argv[index + 1] || null;
}

const getMonthName = (monthNumber) => {
    const date = new Date(2000, monthNumber - 1, 1)
    return date.toLocaleString('en-US', {month: 'long'})
}

let expData = [];

const addExp = async() => {
    try{
        if(fs.existsSync(path.join(__dirname, 'data.json'))){
            const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf8')
            expData = JSON.parse(data)
        }
        if(!getFlagValue('--description')){
            handleError('You must provide a description with --description')
            return
        }
        if(!getFlagValue('--amount')){
            handleError('You must provide an amount with --amount')
            return
        }
        if(getFlagValue('--amount') < 0){
            handleError(`Amount must be a positive number`)
            return
        }
        const newExp = {
            id: expData.length ? Math.max(...expData.map(t => t.id)) + 1 : 1,
            description: getFlagValue('--description'),
            amount: Number(getFlagValue('--amount')),
            category: getFlagValue('--category') || 'general',
            date: new Date().toLocaleDateString('en-GB').replaceAll('/', '-'),
        }

        expData.push(newExp)

        fs.promises.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(expData))
        console.log(`Expense added successfully (ID: ${newExp.id})`)
    }catch(err){
        console.log(err)
    }
}


const updateExp = async() => {
    try{
        const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf8')
        if(!data){
            handleError(`No such file exist`)
            return
        }
        expData = JSON.parse(data)
        if(!getFlagValue('--id')){
            handleError('You must provide an ID with --id')
            return
        }
        const exp = expData.find(e => e.id.toString() === getFlagValue('--id'))
        if(!exp){
            handleError(`No expense found with ID: ${getFlagValue('--id')}`)
            return
        }
        if(getFlagValue('--amount') !== undefined && getFlagValue('--amount') !== null){
            if(isNaN(Number(getFlagValue('--amount')))){
                handleError('Amount must be a valid number')
                return
            }
            if(Number(getFlagValue('--amount')) < 0){
                handleError('Amount must be a positive value')
                return
            }
        }
        exp.description = getFlagValue('--description') || exp.description
        const newAmount = getFlagValue('--amount')
        exp.amount = newAmount !== undefined && newAmount !== null ? Number(newAmount) : exp.amount
        exp.date = new Date().toLocaleDateString('en-GB').replaceAll('/', '-')
        exp.category = getFlagValue('--category') || exp.category

        await fs.promises.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(expData))
        console.log(`Expense updated successfully (ID: ${exp.id})`)
    }catch(err){
        console.log(err)
    }
}

const getListExp = async() => {
    try{
        const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf8')
        const listData = JSON.parse(data)
        console.log(
            "ID".padEnd(5) +
            "Date".padEnd(14) +
            "Description".padEnd(14) +
            "Amount"
        )
        listData.map(i => {
            console.log(
                String(i.id).padEnd(5) +
                String(i.date).padEnd(14) +
                i.description.padEnd(14) +
                `$${i.amount}`
            )
        })
    }catch(err){
        console.log(err)
    }
}

const getSummary = async() => {
    try{
        const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf8')
        if(!data){
            handleError(`No such file exist`)
            return
        }
        const listData = JSON.parse(data)
        const totalPrice = listData.reduce((sum, i) => sum + i.amount, 0)

        console.log(`Total expenses: ${totalPrice}$`)
    }catch(err){
        console.log(err)
    }
}

const getSummaryFiltered = async() => {
    try{
        const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf8')
        if(!data){
            handleError(`No such file exist`)
            return
        }
        const listData = JSON.parse(data)
        if(!getFlagValue('--month')){
            handleError('You must provide a month with --month')
            return
        }
        const month = getFlagValue('--month')
        if(isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12){
            handleError('Month must be a number between 1 and 12')
            return
        }
        const filtered = listData.filter(i => {
            if(Number(i.date.split('-')[2]) === new Date().getFullYear()){
                const itemMonth = i.date.split('-')[1]
                return Number(itemMonth) === Number(month)
            }
        })
        if(filtered.length === 0){
            console.log(`No data on month: ${month}`)
            return
        }
        const totalAmount = filtered.reduce((sum, i) => sum + i.amount, 0)
        console.log(`Total expenses for ${getMonthName(month)} : ${totalAmount}$`)
    }catch(err){
        console.log(err)
    }
}

const getCategory = async() => {
    try{
        const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf8')
        if(!data){
            handleError('No such file found')
            return
        }

        const category = getFlagValue('--category')
        if(!category){
            handleError('You must provide a category name with --category')
            return
        }

        const dataList = JSON.parse(data)
        const catList = dataList.filter(i => i.category === category)
        if(catList.length === 0){
            console.log(`No data found with category: ${category}`)
        }
        console.log(
            'ID'.padEnd(4) +
            "Description".padEnd(14) +
            "Date".padEnd(14) +
            "Amount"
        )
        catList.map(i => {
            console.log(
                String(i.id).padEnd(4) +
                i.description.padEnd(14) +
                i.date.padEnd(14) +
                `$${i.amount}`
            )
        })
    }catch(err){
        console.log(err)
    }
}

const deleteExp = async() => {
    try{
        const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf8')
        if(!data){
            handleError(`No such file exist`)
            return
        }
        if(!getFlagValue('--id')){
            handleError('You must provide an ID with --id')
            return
        }
        const listData = JSON.parse(data)
        const idToDelete = getFlagValue('--id')
        if(!listData.some(i => i.id.toString() === idToDelete)){
            handleError(`No expense found with ID: ${idToDelete}`)
            return
        }
        const sinData = listData.filter(i => i.id.toString() !== idToDelete)
        fs.promises.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(sinData))
        console.log('Expense deleted successfully')
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
                if(argv.length === 3){
                    getListExp()
                    break;
                }else if(argv.length > 3){
                    getCategory()
                    break;
                }
            case ("summary"):
                if(argv.length === 3){
                    getSummary()
                    break;
                }else if(argv.length > 3){
                    getSummaryFiltered()
                    break
                }
            case "delete":
                deleteExp()
                break;
            default:
                handleError(`argv 2 argument must be those values add update list summary delete`)
                return
        }
    }catch(err){
        console.log(err)
        return
    }
}

main()