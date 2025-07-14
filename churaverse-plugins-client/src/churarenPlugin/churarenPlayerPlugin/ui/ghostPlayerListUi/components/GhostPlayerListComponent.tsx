import style from './GhostPlayerListComponent.module.scss'
import { useEffect, useState } from 'react'

interface GhostPlayerListComponentProps {
  playerNames: string[]
}

export const GhostPlayerListComponent: React.FC<GhostPlayerListComponentProps> = ({ playerNames }) => {
  const [playerNameList, setPlayerNameList] = useState<string[]>([])

  useEffect(() => {
    setPlayerNameList(playerNames)
  }, [playerNames])

  return (
    <div className={style.container} style={{ display: playerNameList.length > 0 ? 'flex' : 'none' }}>
      <div className={style.nameContainer}>
        {playerNameList.map((playerName, index) => (
          <div key={index} className={style.ghostPlayerNameBlock}>
            {playerName}
          </div>
        ))}
      </div>
    </div>
  )
}
