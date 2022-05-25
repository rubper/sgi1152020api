import { readdir, writeFile } from 'fs';
import { kebabToCamelCase } from '../shared/helpers/functions/kebab-to-camel-case.function';
import { camelToKebabCase } from '../shared/helpers/functions/camel-to-kebab-case.function';
import { checkUpperCase } from '../shared/helpers/functions/check-uppercase.function';

const _fileGenerator = (model: string): string => {
  model = kebabToCamelCase(model);
  const modelKebab: string = camelToKebabCase(model);
  if (!checkUpperCase(model)) {
    model = `${model[0].toUpperCase()}${model.substring(1)}`;
  }
  const lowerCaseModel = `${model[0].toLowerCase()}${model.substring(1)}`;
  console.log(`${model}Resolver`);
  return `import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GraphQL${model} } from 'shared/graphql/types/${modelKebab}.graphql';
import { Gql${model}CreateInput } from 'shared/graphql/input-types/create/${modelKebab}.gql-type';
import { Gql${model}UpdateInput } from 'shared/graphql/input-types/update/${modelKebab}.gql-type';
import { GraphQLUUID } from 'shared/graphql/scalar-types/uuid.gql-type';
import { ${model}Service } from 'shared/services/${modelKebab}.service';


@Resolver(() => GraphQL${model})
export class ${model}Resolver {
  constructor(private readonly ${lowerCaseModel}Service: ${model}Service) {}

  @Mutation(() => GraphQL${model})
  create${model}(@Args('create${model}Input') create${model}Input: Gql${model}CreateInput) {
    return this.${lowerCaseModel}Service.create(create${model}Input);
  }

  @Query(() => [GraphQL${model}], { name: '${lowerCaseModel}s' })
  findAll() {
    return this.${lowerCaseModel}Service.findAll();
  }

  @Query(() => GraphQL${model}, { name: '${lowerCaseModel}' })
  findOne(@Args('uuid', { type: () => GraphQLUUID, nullable: true }) id: string) {
    return this.${lowerCaseModel}Service.findOne(id);
  }

  @Mutation(() => GraphQL${model})
  update${model}(@Args('update${model}Input') update${model}Input: Gql${model}UpdateInput) {
    return this.${lowerCaseModel}Service.update(update${model}Input.uuid, update${model}Input);
  }

  @Mutation(() => GraphQL${model})
  remove${model}(@Args('uuid', { type: () => GraphQLUUID }) id: string) {
    return this.${lowerCaseModel}Service.remove(id);
  }
}`;
}

export const resolverGenerator = () => {
  readdir('src/models', (err: NodeJS.ErrnoException, files: string[]) => {
    if(err) {
      console.error(err);
    }
    files.forEach((file: string, index: number) => {
      const modelName = file.split('.')[0];
      const scriptContent = _fileGenerator(modelName);
      let completedWithoutIssues = true;
      writeFile(
        `src/resolvers/graphql/${modelName}.resolver.ts`, 
        scriptContent, 
        (fileErr) => {
          if(fileErr) {
            console.error(fileErr);
            completedWithoutIssues = false;
          }
          if (index === files.length - 1) {
            if (completedWithoutIssues) {
              console.info('GraphQL Resolvers generated successfuly.');
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
resolverGenerator();
