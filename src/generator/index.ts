import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .usage('usage: $0 <command>')
  .scriptName('generate')
  .command('controller', 'Generate a new controller', function (yargs) {
    const argv = yargs
      .example(
        'generate controller --name ExampleController',
        'Generates src/controllers/ExampleController.ts',
      )
      .option('name', { string: true, alias: 'n' })
      .option('route', { string: true, alias: 'r' })
      .option('force', { boolean: true, alias: 'f' })
      .demandOption(['name', 'route'])
      .help('help')
      .alias('h', 'help').argv;

    checkCommands(yargs, argv, 1);

    const content = `
import { JsonController } from 'routing-controllers';
import { BaseController } from './BaseController';

@JsonController('/${argv.route}')
export class ${argv.name} extends BaseController {

}
`;

    const filePath = path.join(__dirname, '..', 'controllers', `${argv.name}.ts`);

    createFile(filePath, content, argv.force);
  })
  .command('service', 'Generate a new service', function (yargs) {
    const argv = yargs
      .example(
        'generate service --name ExampleService',
        'Generates src/services/ExampleService.ts',
      )
      .option('name', { string: true, alias: 'n' })
      .option('force', { boolean: true, alias: 'f' })
      .demandOption(['name'])
      .help('help')
      .alias('h', 'help').argv;

    checkCommands(yargs, argv, 1);

    const content = `
import { Service } from 'typedi';

@Service
export class ${argv.name} {

}
`;

    const filePath = path.join(__dirname, '..', 'services', `${argv.name}.ts`);

    createFile(filePath, content, argv.force);
  })
  .command('enum', 'Generate a new enum', function (yargs) {
    const argv = yargs
      .example('generate enum --name MyEnum', 'Generates src/enums/MyEnum.ts')
      .option('name', { string: true, alias: 'n' })
      .option('force', { boolean: true, alias: 'f' })
      .demandOption(['name'])
      .help('help')
      .alias('h', 'help').argv;

    checkCommands(yargs, argv, 1);

    const content = `
export enum ${argv.name} {

}
`;

    const filePath = path.join(__dirname, '..', 'enums', `${argv.name}.ts`);

    createFile(filePath, content, argv.force);
  })
  .command('model', 'Generate a new model', function (yargs) {
    const argv = yargs
      .example('generate model --name User', 'Generates User.ts model')
      .option('name', { string: true, alias: 'n' })
      .option('force', { boolean: true, alias: 'f' })
      .demandOption(['name'])
      .help('help')
      .alias('h', 'help').argv;

    checkCommands(yargs, argv, 1);

    const content = `
      import { PrimaryColumn, Entity } from 'typeorm';

      @Entity()
      export class ${argv.name} {
        
        @PrimaryColumn('uuid')
        public id: string;

      }`;

    const filePath = path.join(
      __dirname,
      '..',
      'models',
      'entities',
      `${argv.name}.ts`,
    );

    createFile(filePath, content, argv.force);
  })
  .command('seeder', 'Generate a new seeder', function (yargs) {
    const argv = yargs
      .example(
        'generate seeder --name ExampleSeeder',
        'Generates src/seeders/ExampleSeeder.ts',
      )
      .option('name', { string: true, alias: 'n' })
      .option('model', { string: true, alias: 'm' })
      .option('count', { number: true, alias: 'c' })
      .option('force', { boolean: true, alias: 'f' })
      .demandOption(['name', 'model'])
      .help('help')
      .alias('h', 'help').argv;

    checkCommands(yargs, argv, 1);

    const content = `
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';

import { ${argv.model} } from '../models/entities/${argv.model}';

export class ${argv.name} implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(${argv.model})({}).createMany(${argv.count || 10});
  }
}`;

    const filePath = path.join(__dirname, '..', 'seeders', `${argv.name}.ts`);

    createFile(filePath, content, argv.force);
  })
  .help('h')
  .alias('h', 'help')
  .version('1.0.1')
  .epilog(`copyright ${new Date().getFullYear()}`).argv;

checkCommands(yargs, argv, 1);

function checkCommands(yargs, argv, numRequired: number) {
  if (argv._.length < numRequired) {
    yargs.showHelp();
  } else {
    // check for unknown command
  }
}

function createFile(filePath: string, content: string, force: boolean) {
  if (fs.existsSync(filePath) && !force) {
    throw new Error('File already exists');
  }

  fs.writeFileSync(filePath, content.trim());
}
