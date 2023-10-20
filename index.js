import puppeteer from 'puppeteer'
import { randomCode } from './random.js'

const url = 'https://client-lv0l.onrender.com/'
const answerAmount = 2
let count = 0
let countFail = 0
const voteFunction = async (page, randArr) => {
    const randomAnswer = randArr[Math.floor(Math.random() * answerAmount)]

    const ansButton = `[aria-label="${randomAnswer}"]`
    const ansElement = await page.waitForSelector(ansButton)
    await ansElement.click()

    await ansElement.dispose()
}

const createPoll = async (page) => {
    const titleInput = 'title'
    const titleInputElement = await page.waitForSelector(`#${titleInput}`)
    await titleInputElement.click()
    const randomTitle = await randomCode()

    await page.type(`#${titleInput}`, randomTitle)

    const randArr = []
    for (let i = answerAmount; i > 0; i--) {
        const randString = await randomCode()
        const answerInput = 'answer'
        const answerInputElement = await page.waitForSelector(`#${answerInput}`)
        await answerInputElement.click()
        await page.type(`#${answerInput}`, randString)

        const addAnswerButton = '[aria-label="Add answer"]'
        const buttonElement = await page.waitForSelector(addAnswerButton)

        await buttonElement.click()
        await buttonElement.dispose()
        await answerInputElement.dispose()

        randArr.push(randString)
    }
    const createPollButton = '[aria-label="Create Poll"]'
    const createPollElement = await page.waitForSelector(createPollButton)
    await createPollElement.click()

    await createPollElement.dispose()
    await titleInputElement.dispose()

    await voteFunction(page, randArr)
}

const gotToCreatePoll = async (page) => {
    const buttonSelector = '[aria-label="Create poll"]'
    const element = await page.waitForSelector(buttonSelector)

    await element.click()

    await element.dispose()
}

const startCheck = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            slowMo: 100
        })

        const page = await browser.newPage()

        await page.goto(url)
        await gotToCreatePoll(page)
        await createPoll(page)

        await browser.close()
        return { message: 'done' }
    } catch (error) {
        console.log(error.message)
    }
}

setInterval(async () => {
    console.log('Creating poll....')
    const res = await startCheck()
    if (res?.message === 'done') {
        count++

        console.log(`Done`)
        console.log(`Number of polls created this session: ${count}`)
    } else {
        countFail++
        console.log('creating poll failed.')
        console.log(`Number of failed polls this session:${countFail}`)
    }
}, 240000)
