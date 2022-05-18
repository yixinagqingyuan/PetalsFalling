import { Option } from './type'
export const random = function random(min: number, max: number) {
    return Math.round(min + Math.random() * (max - min));
}
export const defaults: Option = {
    flakeCount: 35,
    flakeColor: 'red',
    flakePosition: 'absolute',
    flakeIndex: 999999,
    minSize: 1,
    maxSize: 2,
    minSpeed: 1,
    maxSpeed: 5,
    round: false,
    shadow: false,
}