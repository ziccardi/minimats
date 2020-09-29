export class PluginState {
  private readonly state: string;

  static INSTALLED = new PluginState('installed');
  static RESOLVED = new PluginState('resolved');
  static STARTING = new PluginState('starting');
  static STOPPING = new PluginState('stopping');
  static ACTIVE = new PluginState('active');
  static UNINSTALLED = new PluginState('uninstalled');

  private constructor(state: string) {
    this.state = state;
  }

  static values = () => [
    PluginState.INSTALLED,
    PluginState.RESOLVED,
    PluginState.STARTING,
    PluginState.STOPPING,
    PluginState.ACTIVE,
    PluginState.UNINSTALLED,
  ];
}
