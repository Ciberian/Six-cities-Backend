import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        ${chalk.bold.underline('Пример:')}
            ${chalk.bold.blue.underline('main.js --<command> [--arguments]')}
        ${chalk.bold.underline('Команды:')}
            ${chalk.rgb(65, 190, 206)('--version:')}                   # Выводит информацию о версии приложения
            ${chalk.rgb(100, 24, 244)('--help:')}                      # Выводит список и описание всех поддерживаемых аргументов
            ${chalk.rgb(112, 23, 155)('--import <path>:')}             # Импортирует в базу данных информацию из tsv-файла
            ${chalk.rgb(223, 145, 67)('--generator <n> <path> <url>')} # Создаёт файл в формате tsv с тестовыми данными.
        `);
  }
}
