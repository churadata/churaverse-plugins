import { Device } from '../../domain/localDevice/device'
import { IBaseLocalDeviceManager } from '../../interface/ILocalDeviceManager/IBaseLocalDeviceManager'
import { DomManager, IEventBus, IMainScene, JSXFunc } from 'churaverse-engine-client'
import { SwitchLocalDeviceEvent } from '../../event/switchLocalDeviceEvent'
import { ISettingDialog } from '../../../coreUiPlugin/interface/ISettingDialog'

export class DeviceSelector<DeviceType extends Device> {
  private readonly selectTag: HTMLSelectElement

  public constructor(
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly deviceManager: IBaseLocalDeviceManager<DeviceType>,
    settingDialog: ISettingDialog,
    devices: DeviceType[],
    selectTagId: string,
    component: JSXFunc<{ devices: DeviceType[] }>
  ) {
    const content = DomManager.jsxToDom(component({ devices }))
    settingDialog.addContent('peripheralSetting', content)

    this.selectTag = DomManager.getElementById<HTMLSelectElement>(selectTagId)
    this.selectTag.addEventListener('change', () => this.onSelect())
  }

  /**
   * デバイスを選択した際に実行するメソッド
   */
  private onSelect(): void {
    this.deviceManager
      .getDevices()
      .then((devices) => {
        devices.forEach((device) => {
          if (device.id === this.selectTag.value) {
            this.eventBus.post(new SwitchLocalDeviceEvent(device))
            this.deviceManager.switchDevice(device)
          }
        })
      })
      .catch(() => {
        console.error('デバイスを取得できませんでした')
      })
  }

  public updateLocalDevices(devices: DeviceType[]): void {
    this.setOptions(devices)

    for (const option of this.selectTag.options) {
      if (option.value === devices[0].id) {
        option.selected = true
        this.deviceManager.switchDevice(devices[0])
        return
      }
    }
  }

  /**
   * セレクトタグに選択肢を定義する
   */
  private setOptions(devices: DeviceType[]): void {
    // 既にある選択肢を全て削除
    while (this.selectTag.firstChild != null) {
      this.selectTag.removeChild(this.selectTag.firstChild)
    }

    for (const device of devices) {
      this.addOption(device)
    }
  }

  /**
   * セレクトタグに選択肢を追加する
   */
  private addOption(device: DeviceType): void {
    const option = document.createElement('option')
    option.value = device.id
    option.textContent = device.name

    const noDeviceMsg = '利用可能なデバイスを取得できません'
    if (option.textContent === '') {
      option.textContent = noDeviceMsg
    }

    this.selectTag.appendChild(option)
  }
}
