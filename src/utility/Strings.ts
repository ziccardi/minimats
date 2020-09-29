export class Strings {
  public static readonly hasText = (instance: string): boolean =>
    '' !== instance.replace(/(^\s*)|(\s*$)/g, '');

  public static readonly trim = (instance: string): string =>
    instance.replace(/(^\s*)|(\s*$)/g, '');
}
