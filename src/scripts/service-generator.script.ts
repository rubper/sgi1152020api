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
  console.log(`${model}Service`);
  return `import { Injectable } from '@nestjs/common';
import { I${model} } from 'interfaces/${modelKebab}.interface';
import { ${model} } from 'models/${modelKebab}.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Injectable()
export class ${model}Service {
  create(createDto: CreateDTO<I${model}>) {
    new ${model}(createDto).save();
  }

  findAll() {
    return ${model}.find();
  }

  findOne(id: string) {
    return ${model}.findOne(id);
  }

  update(id: string, updateDto: UpdateDTO<I${model}>) {
    return ${model}.findOne(id).then(
      (${lowerCaseModel}: ${model}) => {
        ${lowerCaseModel}.mapValueFromBase(updateDto);
        ${lowerCaseModel}.save();
      }
    );
  }

  remove(id: string) {
    return ${model}.findOne(id).then(
      (${lowerCaseModel}: ${model}) => {
        ${lowerCaseModel}.softRemove();
      }
    );
  }
}`;
}

export const serviceGenerator = () => {
  readdir('src/models', (err: NodeJS.ErrnoException, files: string[]) => {
    if(err) {
      console.error(err);
    }
    files.forEach((file: string, index: number) => {
      const modelName = file.split('.')[0];
      const scriptContent = _fileGenerator(modelName);
      let completedWithoutIssues = true;
      writeFile(
        `src/shared/services/${modelName}.service.ts`, 
        scriptContent, 
        (fileErr) => {
          if(fileErr) {
            console.error(fileErr);
            completedWithoutIssues = false;
          }
          if (index === files.length - 1) {
            if (completedWithoutIssues) {
              console.info('Services generated successfuly.');
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
serviceGenerator();
