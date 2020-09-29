/**
 * Plug-in dependency constraint
 */
import {Version} from '../Version';
import {ResolveState} from './ResolveState';

export class DependencyConstraint {
  private readonly id: string;
  private readonly version: Version;
  private state: ResolveState = ResolveState.RESOLVABLE;
  private cause = '';

  constructor(id: string, version: Version) {
    this.id = id;
    this.version = version;
  }

  public readonly markResolvable = () => {
    this.state = ResolveState.RESOLVABLE;
    this.cause = '';
  };

  public readonly markFailed = (cause: string) => {
    this.state = ResolveState.RESOLVEFAILED;
    this.cause = cause;
  };

  public readonly markSuccess = () => {
    this.state = ResolveState.RESOLVESUCCESS;
    this.cause = '';
  };

  public readonly isSatisfy = (pluginMetadata: PluginMetadata): boolean =>
    this.id === pluginMetadata.id &&
    pluginMetadata.version.compare(this.version) >= 0;
}
