import style from '../style.module.scss'
import { JSXFunc, AbstractDOMLayerNames } from 'churaverse-engine-client'
import { DIALOG_SECTION_CONTAINER_ID } from '../dialog'

export interface Props {
  dialogName: string
  layer?: AbstractDOMLayerNames
}

export const DialogPanel: JSXFunc<Props> = (props: Props) => {
  return (
    <div className={style.container}>
      <div className={style.dialogLabel}>{props.dialogName}</div>
      <div className={style.sectionContainer} id={DIALOG_SECTION_CONTAINER_ID(props.dialogName)}></div>
    </div>
  )
}
