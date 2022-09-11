import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            --version:                   # Выводит информацию о версии приложения
            --help:                      # Выводит список и описание всех поддерживаемых аргументов
            --import <path>:             # Импортирует в базу данных информацию из tsv-файла
            --generator <n> <path> <url> # Создаёт файл в формате tsv с тестовыми данными.
        `);
  }
}
