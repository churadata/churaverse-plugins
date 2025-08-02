import { JSXFunc } from 'churaverse-engine-client'
import style from './DescriptionWindowComponent.module.scss'
import { DESCRIPTION_TEXT_ID } from '../descriptionWindow'

interface DescriptionWindowProps {
  description: string
}

export const DescriptionWindowComponent: JSXFunc<DescriptionWindowProps> = ({
  description,
}: DescriptionWindowProps) => {
  return (
    <div className={style.container}>
      <p id={DESCRIPTION_TEXT_ID}>{description}</p>
    </div>
  )
}
