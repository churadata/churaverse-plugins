/**
 * 1つのパケットに同種のMessageをまとめる際のデータ保持の方法
 *
 * ---
 *
 * |||
 * |-|-|
 * |firstOnly    |最初に追加されたデータのみ保持|
 * |lastOnly     |最後に追加されたデータのみ保持|
 * |queue        |追加した順に保持|
 * |stack        |追加した逆順に保持|
 * |dest_onlySelf|dest=onlySelfのMessageはfrontendから送信しないためデータ保持の方法を考慮しない|
 *
 */
export type BufferType = 'firstOnly' | 'lastOnly' | 'queue' | 'stack' | 'dest=onlySelf'
