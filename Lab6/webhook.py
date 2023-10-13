import os
import logging
import random

from aiogram import Bot, types
from aiogram.contrib.middlewares.logging import LoggingMiddleware
from aiogram.dispatcher import Dispatcher
from aiogram.dispatcher.webhook import SendMessage
from aiogram.utils.executor import start_webhook


API_TOKEN = os.environ['TG_TOKEN']


# webhook settings
WEBHOOK_HOST = 'https://nazar.alwaysdata.net/'
WEBHOOK_PATH = '/bot/'
WEBHOOK_URL = f"{WEBHOOK_HOST}{WEBHOOK_PATH}"

# webserver settings
WEBAPP_HOST = '::'  # or ip
WEBAPP_PORT = 8350

logging.basicConfig(level=logging.INFO)

bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)
dp.middleware.setup(LoggingMiddleware())

user_data = {}

@dp.message_handler(commands=['start'])
async def on_start(message: types.Message):
    user_id = message.from_user.id
    user_data[user_id] = {'items': []}
    await message.answer(f"Вас вітає бот вибору випадкових пунктів зі списку. Додайте пункти до вашого списку, використовуючи команду /additem. \n"
                         f"Коли закінчите, використайте команду /choose для вибору випадкових пунктів.\n"
                        f"Використайте команду /viewlist, щоб переглянути весь список."
                        f"Для очищення списку, використайте команду /clear.")

@dp.message_handler(commands=['additem'])
async def add_item_request(message: types.Message):
    user_id = message.from_user.id
    user_data[user_id]['adding_item'] = True
    await message.answer("Надішліть пункт для додавання до вашого списку.")

@dp.message_handler(lambda message: user_data.get(message.from_user.id, {}).get('adding_item', False))
async def add_item(message: types.Message):
    user_id = message.from_user.id
    item = message.text
    user_data[user_id]['items'].append(item)
    user_data[user_id]['adding_item'] = False
    
    items_list = "\n".join([f"- {item}" for item in user_data[user_id]['items']])
    response_text = f"Пункт '{item}' додано до вашого списку.\n\nОсь ваш список:\n{items_list}"

    await message.answer(response_text)

@dp.message_handler(commands=['choose'])
async def start_choose_items(message: types.Message):
    user_id = message.from_user.id
    user_data[user_id]['choosing_items'] = True
    await message.answer("Вкажіть, скільки пунктів ви хочете вибрати зі списку.")
    
@dp.message_handler(lambda message: user_data.get(message.from_user.id, {}).get('choosing_items', False))
async def choose_items_count(message: types.Message):
    user_id = message.from_user.id
    try:
        num_to_choose = int(message.text)
        if num_to_choose <= 0:
            raise ValueError
        user_data[user_id]['num_to_choose'] = num_to_choose
        user_data[user_id]['choosing_items'] = False

        items = user_data[user_id]['items']
        if len(items) < num_to_choose:
            await message.answer("Ваш список містить менше пунктів, ніж ви хочете вибрати.")
        else:
            chosen_items = random.sample(items, num_to_choose)
            response_text = "Ось ваші випадково вибрані пункти:\n"
            for item in chosen_items:
                response_text += f"- {item}\n"
            await message.answer(response_text)
    except ValueError:
        await message.answer("Введіть правильну кількість пунктів для вибору.")
        
@dp.message_handler(commands=['viewlist'])
async def view_list(message: types.Message):
    user_id = message.from_user.id
    if user_id in user_data:
        items = user_data.get(user_id, {}).get('items', [])
        if not items:
            await message.answer("Ваш список порожній.")
        else:
            items_list = "\n".join([f"- {item}" for item in user_data[user_id]['items']])
            response_text = f"Ось ваш список:\n{items_list}"
            await message.answer(response_text)
    else:
        await message.answer("Спершу почніть використовувати бота командою /start.")
        
@dp.message_handler(commands=['clear'])
async def clear_list(message: types.Message):
    user_id = message.from_user.id
    if user_id in user_data:
        user_data[user_id]['items'] = []
        await message.answer("Список пунктів був успішно очищений.")
    else:
        await message.answer("Спершу почніть використовувати бота командою /start.")

async def on_startup(dp):
    await bot.set_webhook(WEBHOOK_URL)
    # insert code here to run it after start


async def on_shutdown(dp):
    logging.warning('Shutting down..')

    # insert code here to run it before shutdown

    # Remove webhook (not acceptable in some cases)
    await bot.delete_webhook()

    # Close DB connection (if used)
    await dp.storage.close()
    await dp.storage.wait_closed()

    logging.warning('Bye!')


if __name__ == '__main__':
    start_webhook(
        dispatcher=dp,
        webhook_path=WEBHOOK_PATH,
        on_startup=on_startup,
        on_shutdown=on_shutdown,
        skip_updates=True,
        host=WEBAPP_HOST,
        port=WEBAPP_PORT,
    )