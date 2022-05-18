
import type { PositionProperty } from 'csstype'
import type { CSSProperties } from 'vue'
export interface Option {
    flakeCount: number,
    flakeColor: string,
    flakePosition: PositionProperty,
    flakeIndex: number,
    minSize: number,
    maxSize: number,
    minSpeed: number,
    maxSpeed: number,
    round: boolean,
    shadow: boolean,
}
export interface Flakes {
    style: CSSProperties,
    speed: number,
    top: number,
    left: number,
    stepSize: number,
    step: number
}