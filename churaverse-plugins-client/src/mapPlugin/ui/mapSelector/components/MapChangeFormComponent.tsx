import { MapSelectorComponent } from '../../../../playerPlugin/ui/playerSetting/components/MapSelectorComponent'
import dialogStyle from '../../../../coreUiPlugin/dialog/style.module.scss'
import style from './MapChangeFormComponent.module.scss'
import { MAP_CHANGE_FORM_ID, MAP_NAME_LIST_ID } from '../mapSelector'
import { JSXFunc } from 'churaverse-engine-client'

export const MapChangeFormComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div className={dialogStyle.itemLabel}> Map切り替え </div>
      <div className={style.mapSelector}>{MapChangeForm()}</div>
    </div>
  )
}

const MapChangeForm: JSXFunc = () => {
  return (
    <div id={MAP_CHANGE_FORM_ID}>
      <MapSelectorComponent selectorId={MAP_NAME_LIST_ID} />
    </div>
  )
}
