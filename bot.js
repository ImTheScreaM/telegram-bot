// Telegram
const TelegramBot = require('node-telegram-bot-api')
const { message } = require('telegraf/filters')
// Express
const express = require('express')
const server = express()
const path = require('path')

const port = process.env.PORT || 5000

// Bot settings
const TOKEN = '6729124736:AAHsDRNT9y1kDq6pfzDsafVM_A5AZCz9uzs'
const bot = new TelegramBot(TOKEN, { polling: true })

const chats = {}

// Option keyboard

const gameOptions = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[
				{ text: '1', callback_data: '1' },
				{ text: '2', callback_data: '2' },
				{ text: '3', callback_data: '3' },
			],
			[
				{ text: '4', callback_data: '4' },
				{ text: '5', callback_data: '5' },
				{ text: '6', callback_data: '6' },
			],
			[
				{ text: '7', callback_data: '7' },
				{ text: '8', callback_data: '8' },
				{ text: '9', callback_data: '9' },
			],
			[{ text: '0', callback_data: '0' }],
		],
	}),
}

const startOptions = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[
				{ text: 'info', callback_data: '/info' },
				{ text: 'number', callback_data: '/number' },
			],[{text:"TicTaeToe",url:"https://imthescream.github.io/TTToeX0/"}]
		]
	})
}

const againOptions = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[
				{ text: 'Играть еще раз', callback_data: '/again' },
				{ text: 'Выйти назад', callback_data: '/exit' },
			],
		]
	})
}

// Games

const number_game = async chatId => {
  const random_number = Math.floor(Math.random() * (9 - 0 + 1) + 0)
  chats[chatId] = random_number
  await bot.sendMessage(
		chatId,
		'Я сейчас загадаю число от 0 до 9 ,а ты должен ее угадать',console.log(random_number)
	)
	await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

// Functions

const start_bot = async chatId => {
	await bot.sendMessage(
		chatId,
		"Hello it's bot for school project",
		startOptions
	)
}

const start_info = async chatId => {
	await bot.sendMessage(chatId, `Дарова чушпан`)
}

const start_game = async chatId => {
	await number_game(chatId)
}

const start = (msg) => {
	bot.setMyCommands([
		{ command: '/start', description: 'Начальное привествие' },
		{ command: '/info', description: 'Информация о пользователе' },
		{ command: '/number', description: 'Игра угадай число' },
	])

	bot.on('message', async msg => {
		const text = msg.text
		const chatId = msg.chat.id
		if (text === '/start') {
			return start_bot(chatId)
		}

		if (text === '/info') {
			return start_info(chatId)
		}

		if (text === '/number') {
			return number_game(chatId) 
		}
    if(text === "/TTT") {
      let url = 'https://imthescream.github.io/TTToeX0/'
      const gameName = "TTToeX0"
        bot.sendGame(msg.chat.id, gameName);
      
      bot.on('callback_query', function onCallbackQuery(callbackQuery) {
        bot.answerCallbackQuery(callbackQuery.id, { url });
      });
    }
})
}

start()

bot.on('callback_query', async msg => {
	const data = msg.data
	const chatId = msg.message.chat.id
	// Switch inline keybord

	if (data == '/info') {
		return start_info(chatId)
	} else if (data == '/number') {
		return start_game(chatId)
	} else if (data == '/again') {
		return start_game(chatId)
	} else if (data == '/exit') {
		return start_bot(chatId)
	}
	// Number guessed right or no
  if(data == undefined) return null
	if (data == chats[chatId]) {
		bot.sendMessage(
			chatId,
			`Молодец ты отгадал цисло ${chats[chatId]}`,
			againOptions
		)
	} else  {
		return bot.sendMessage(
			chatId,
			`К сожалению ты не отгадал,бот загадал число ${chats[chatId]}`,
			againOptions
		)
	} 
  console.log(data);
})

server.listen(port, () => {
	console.log(`${port}`)
})
