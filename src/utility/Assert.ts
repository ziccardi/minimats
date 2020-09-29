import {Strings} from './Strings';
import * as fs from 'fs';
import {PathLike} from 'fs';

export class Assert {
  static notNull(name: string, instance: unknown) {
    if (instance) {
      return;
    }

    throw new Error(`The parameter ${name} can not be null.`);
  }

  static notEmptyArray(name: string, instance: unknown) {
    Assert.notNull(name, instance);

    if (Array.isArray(instance) && instance.length > 0) {
      return;
    }

    throw new Error(
      `The parameter ${name} must be array and can not be empty.`
    );
  }

  static notEmpty(name: string, instance: string) {
    if (Strings.hasText(instance)) {
      return;
    }

    throw new Error(
      `The parameter ${name} must be string and can not be empty.`
    );
  }

  static notExists(instance: PathLike) {
    if (fs.existsSync(instance)) {
      return;
    }

    throw new Error(`The file ${instance} does not exists.`);
  }
}
