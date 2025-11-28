import { JSXFunc } from 'churaverse-engine-client'
import style from './DescriptionWindowComponent.module.scss'

interface DescriptionWindowProps {
  description: string
}

export const DescriptionWindowComponent: JSXFunc<DescriptionWindowProps> = ({
  description,
}: DescriptionWindowProps) => {
  return (
    <div className={style.container}>
      <div
        className={style.descriptionText}
        data-role="description-text"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  )
}
