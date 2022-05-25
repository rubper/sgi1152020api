import { readdir, writeFile } from 'fs';
import { kebabToCamelCase } from '../shared/helpers/functions/kebab-to-camel-case.function';
import { camelToKebabCase } from '../shared/helpers/functions/camel-to-kebab-case.function';
const _checkUpperCase = (str: string) => {
  return str[0] === str[0].toUpperCase();
}
const _fileGenerator = (model: string): string => {
  model = kebabToCamelCase(model);
  const modelKebab: string = camelToKebabCase(model);
  if (!_checkUpperCase(model)) {
    model = `${model[0].toUpperCase()}${model.substring(1)}`;
  }
  const lowerCaseModel = `${model[0].toLowerCase()}${model.substring(1)}`;
  console.log(`${model}Controller`);
  return `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ${model}Service } from 'core/services/${modelKebab}.service';
import { I${model} } from 'interfaces/${modelKebab}.interface';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Controller('${modelKebab}')
export class ${model}Controller {
  constructor(private readonly ${lowerCaseModel}Service: ${model}Service) {}

  @Post()
  create(@Body() create${model}Dto: CreateDTO<I${model}>) {
    return this.${lowerCaseModel}Service.create(create${model}Dto);
  }

  @Get()
  findAll() {
    return this.${lowerCaseModel}Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${lowerCaseModel}Service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update${model}Dto: UpdateDTO<I${model}>) {
    return this.${lowerCaseModel}Service.update(id, update${model}Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${lowerCaseModel}Service.remove(id);
  }
}`;
}

export const controllerGenerator = () => {
  readdir('src/models', (err: NodeJS.ErrnoException, files: string[]) => {
    if(err) {
      console.error(err);
    }
    files.forEach((file: string, index: number) => {
      const modelName = file.split('.')[0];
      const scriptContent = _fileGenerator(modelName);
      let completedWithoutIssues = true;
      writeFile(
        `src/controllers/rest/${modelName}.controller.ts`, 
        scriptContent, 
        (fileErr) => {
          if(fileErr) {
            console.error(fileErr);
            completedWithoutIssues = false;
          }
          if (index === files.length - 1) {
            if (completedWithoutIssues) {
              console.info('Controllers generated successfuly.');
              console.info('You can close this window now.');
            } else {
              console.warn('Tasks completed with some errors,');
              console.warn('please check logs.');
            }
          }
        });
    });
    
  });
  const model: string = '';
};
controllerGenerator();
