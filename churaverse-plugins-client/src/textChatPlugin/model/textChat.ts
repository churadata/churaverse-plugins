export class TextChat {
  public readonly playerId: string
  private _name: string
  private _message: string

  public constructor(playerId: string, name: string, message: string) {
    this.playerId = playerId
    this._name = name
    this._message = message
  }

  public editPlayerName(name: string): void {
    this._name = name
  }

  public editPlayerMessage(message: string): void {
    this._message = message
  }

  public get name(): string {
    return this._name
  }

  public get message(): string {
    return this._message
  }
}
