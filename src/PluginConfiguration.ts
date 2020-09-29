import {Assert} from './utility/Assert';
import {Strings} from './utility/Strings';
import {Version} from './Version';
import {PluginState} from './PluginState';
import * as Constants from './Constants';

interface PluginConfigurationData {
  id: string;
  name: string;
  activator: string;
}

export class PluginConfiguration {
  private readonly pluginConfigFile: string;
  public readonly pluginConfigurationData: PluginConfigurationData;
  private dependencies:[unknown] = [];
  private services:[unknown] = [];
  private extensions:[unknown] = [];

  constructor(pluginConfigFile: string) {
    Assert.notExists(pluginConfigFile);

    this.pluginConfigFile = pluginConfigFile;
    this.pluginConfigurationData = require(pluginConfigFile);

    Assert.notNull('pluginConfiguration', this.pluginConfigurationData);
    Assert.notEmpty('id', this.pluginConfigurationData.id);

    this.parseBasic();
    this.parseDependencies();
    this.parseServices();
    this.parseExtensions();
  }

  /**
   * 插件配置文件plugin.json的路径
   *
   * @readonly
   * @memberof PluginConfiguration
   */
  get pluginConfigFileFullPath() {
    return this.pluginConfigFile;
  }

  /**
   * 插件id
   *
   * @type {string}
   * @readonly
   * @memberof PluginConfiguration
   */
  get id() {
    return this._id;
  }

  /**
   * 插件名称
   *
   * @type {string}
   * @readonly
   * @memberof PluginConfiguration
   */
  get name() {
    return this._name;
  }

  /**
   * 插件描述
   *
   * @type {string}
   * @readonly
   * @memberof PluginConfiguration
   */
  get description() {
    return this._description;
  }

  /**
   * 插件启动级别，默认为50，越小越早启动
   *
   * @type {number}
   * @readonly
   * @memberof PluginConfiguration
   */
  get startLevel() {
    return this._startLevel;
  }

  /**
   * 插件初始状态，默认为PluginState.ACTIVE
   *
   * @type PluginState
   * @readonly
   * @memberof PluginConfiguration
   */
  get initializedState() {
    return this._initializedState;
  }

  /**
   * 插件版本
   *
   * @type {Version}
   * @readonly
   * @memberof PluginConfiguration
   */
  get version() {
    return this._version;
  }

  /**
   * 插件激活器
   *
   * @readonly
   * @memberof PluginConfiguration
   */
  get activator() {
    return this._activator;
  }

  /**
   * 是否允许停止，默认为true
   *
   * @readonly
   * @memberof PluginConfiguration
   */
  get stoppable() {
    return this._stoppable;
  }

  /**
   * 依赖关系的JSON格式
   *
   * @type {Object[]}
   * @readonly
   * @memberof PluginConfiguration
   */
  get dependencies() {
    return this._dependencies;
  }

  /**
   * 服务的JSON格式
   *
   * @type {Object[]}
   * @readonly
   * @memberof PluginConfiguration
   */
  get services() {
    return this._services;
  }

  /**
   * 扩展的JSON格式
   *
   * @type {Object[]}
   * @readonly
   * @memberof PluginConfiguration
   */
  get extensions() {
    return this._extensions;
  }

  /**
   * 解析基本信息
   *
   * @memberof PluginConfiguration
   */
  parseBasic() {
    this._id = this._pluginConfigurationData.id;
    this._name = this._pluginConfigurationData.name;
    this._activator = this._pluginConfigurationData.activator;

    if (!Strings.hasText(this._name)) {
      this._name = this._id;
    }

    this._description = this._pluginConfigurationData.description;

    if (!Strings.hasText(this._description)) {
      this._description = this._name;
    }

    this._version = new Version(this._pluginConfigurationData.version);

    this._startLevel = parseInt(
      this._pluginConfigurationData.startLevel || Constants.defaultStartLevel
    );
    if (isNaN(this._startLevel)) {
      throw new Error(
        `The startLevel is not legal number of ${this.pluginConfigFileFullPath}.`
      );
    }

    if (this._pluginConfigurationData.initializedState === 'installed') {
      this._initializedState = PluginState.INSTALLED;
    } else if (
      this._pluginConfigurationData.initializedState === undefined ||
      this._pluginConfigurationData.initializedState === 'active'
    ) {
      this._initializedState = PluginState.ACTIVE;
    } else {
      throw new Error(
        `The initializedState must be installed or active of ${this.pluginConfigFileFullPath}.`
      );
    }

    this.parseStoppable();
  }

  parseStoppable() {
    let stoppable = this._pluginConfigurationData.stoppable;
    if (stoppable === undefined || stoppable === null) {
      stoppable = true;
    } else {
      stoppable = !!stoppable;
    }
    this._stoppable = stoppable;
  }

  /**
   * 解析依赖关系
   *
   * @memberof PluginConfiguration
   */
  parseDependencies() {
    if (
      !(
        this._pluginConfigurationData.dependencies &&
        this._pluginConfigurationData.dependencies instanceof Array
      )
    ) {
      return;
    }

    for (const dependency of this._pluginConfigurationData.dependencies) {
      if (!Strings.hasText(dependency.id)) {
        throw new Error(
          `The dependent plugin id can not be empty of ${this.pluginConfigFileFullPath}.`
        );
      }
      this._dependencies.push({
        id: dependency.id,
        version: new Version(dependency.version),
      });
    }
  }

  /**
   * 解析服务
   *
   * @memberof PluginConfiguration
   */
  parseServices() {
    if (
      !(
        this._pluginConfigurationData.services &&
        this._pluginConfigurationData.services instanceof Array
      )
    ) {
      return;
    }

    for (const service of this._pluginConfigurationData.services) {
      if (!Strings.hasText(service.name)) {
        throw new Error(
          `The service name can not be empty of ${this.pluginConfigFileFullPath}.`
        );
      }
      if (!Strings.hasText(service.service)) {
        throw new Error(
          `The service can not be empty of ${this.pluginConfigFileFullPath}.`
        );
      }
      if (!service.properties) {
        service.properties = {};
      }
      this._services.push({
        name: service.name,
        service: service.service,
        properties: service.properties,
      });
    }
  }

  /**
   * 解析扩展
   *
   * @memberof PluginConfiguration
   */
  parseExtensions() {
    if (
      !(
        this._pluginConfigurationData.extensions &&
        this._pluginConfigurationData.extensions instanceof Array
      )
    ) {
      return;
    }

    for (const extension of this._pluginConfigurationData.extensions) {
      if (!Strings.hasText(extension.id)) {
        throw new Error(
          `The extension id can not be empty of ${this.pluginConfigFileFullPath}.`
        );
      }
      if (!extension.data) {
        throw new Error(
          `The extension data can not be null of ${this.pluginConfigFileFullPath}.`
        );
      }
      this._extensions.push({id: extension.id, data: extension.data});
    }
  }
}
