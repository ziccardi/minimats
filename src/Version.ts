import {Strings} from './utility/Strings';

export class Version {
  private readonly rawVersion: string;
  private major = 0;
  private minor = 0;
  private revision = 0;

  private readonly version: string;

  constructor(version?: string) {
    this.rawVersion = version ?? '';
    this.parse(this.rawVersion);
    this.version = `${this.major}.${this.minor}.${this.revision}`;
  }

  private readonly parse = (versionString: string) => {
    if (Strings.hasText(versionString)) {
      const wrongVersionError = new Error(
        `The version ${versionString} is not correct version.`
      );
      const versionParts = versionString.split('.');
      if (versionParts.length >= 4) {
        throw wrongVersionError;
      }

      this.major = parseInt(versionParts[0]);
      if (versionParts.length >= 2) {
        this.minor = parseInt(versionParts[1]);
      }
      if (versionParts.length >= 3) {
        this.revision = parseInt(versionParts[2]);
      }

      if (isNaN(this.major) || isNaN(this.minor) || isNaN(this.revision)) {
        throw wrongVersionError;
      }
    }
  };

  get versionString(): string {
    return this.version;
  }

  public readonly compare = (otherVersion: Version) => {
    if (this.major !== otherVersion.major) {
      return this.major - otherVersion.major > 0 ? 1 : -1;
    }

    if (this.minor !== otherVersion.minor) {
      return this.minor - otherVersion.minor > 0 ? 1 : -1;
    }

    const result = this.revision - otherVersion.revision;

    return result > 0 ? 1 : result === 0 ? 0 : -1;
  };
}
