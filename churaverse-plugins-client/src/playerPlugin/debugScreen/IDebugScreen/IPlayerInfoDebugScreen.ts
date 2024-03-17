import { Direction } from '../../../../domain/model/core/direction'
import { Position } from '../../../../domain/model/core/position'
import { IDebugScreen } from '../../../debugScreenPlugin/debugScreen/IDebugScreen/IDebugScreen'
import { PlayerColor } from '../../types/playerColor'
import { PlayerRole } from '../../types/playerRole'

export interface IPlayerIdDebugScreen extends IDebugScreen<string> {}

export interface IPlayerNameDebugScreen extends IDebugScreen<string> {}

export interface IPlayerPositionDebugScreen extends IDebugScreen<Position> {}

export interface IPlayerHpDebugScreen extends IDebugScreen<number> {}

export interface IPlayerDirectionDebugScreen extends IDebugScreen<Direction> {}

export interface IPlayerRoleDebugScreen extends IDebugScreen<PlayerRole> {}

export interface IPlayerColorDebugScreen extends IDebugScreen<PlayerColor> {}
