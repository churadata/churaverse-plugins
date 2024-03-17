import { Scenes } from 'churaverse-engine-client'
import { MessageType } from '../message/messages'
import { BufferType } from '../types/bufferType'
import { IMessageConstructor } from './IMessage'

export interface IMessageRegister<Scene extends Scenes> {
  /**
   * Messageを登録する. 各typeの初期化処理を行うため、type毎に1度だけ実行する.
   * @param type 登録するMessageのtype
   * @param MsgClass 登録したいMessageクラス
   * @param bufferType パケット化する際のデータのまとめ方
   */
  registerMessage: <MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    MsgClass: IMessageConstructor<Scene, MsgType>,
    bufferType: BufferType
  ) => void
}
