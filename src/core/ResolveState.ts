export class ResolveState {
  private readonly state: number;

  public static readonly RESOLVABLE = new ResolveState(0);
  public static readonly RESOLVEFAILED = new ResolveState(1);
  public static readonly RESOLVESUCCESS = new ResolveState(2);

  private constructor(state: number) {
    this.state = state;
  }
}
