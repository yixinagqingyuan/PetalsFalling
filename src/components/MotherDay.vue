<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, reactive, ref, onMounted } from 'vue'
import { random, defaults } from './utils'
import { Option, Flakes } from './type'
// 接收 props
const props = defineProps<{
  option?: Partial<Option>
}>()
// 默认参数
const options = Object.assign(defaults, props.option)
const style = {
  '--bg': options.flakeColor,
  position: options.flakePosition,
  zIndex: options.flakeIndex,
}
const element = ref(null)
var widthOffset = ref(0)
// 容器宽高
let elHeight = 0
let elWidth = 0
var snowTimeout = 0
//心形数组
const flakes: Flakes[] = reactive([])
// 设置样式
const setStyle = (top, left) => {
  return {
    ...style,
    top: `${top}px`,
    left: `${left}px`,
  }
}
// 重置样式
const reset = (item) => {
  item.left = random(widthOffset.value, elWidth - widthOffset.value);
  item.top = 0;
  item.speed = random(options.minSpeed, options.maxSpeed);
  item.stepSize = random(1, 10) / 100;
}

// 更新函数
const update = () => {
  console.log(111)
  flakes.forEach((item) => {
    item.top += item.speed;
    if (item.top > elHeight) {
      reset(item)
    }
    item.step += item.stepSize;
    item.left += Math.cos(item.step);
    item.style = setStyle(item.top, item.left)
  })
  snowTimeout = requestAnimationFrame(function () { update() });
}
onMounted(() => {
  elHeight = element.value.offsetHeight
  elWidth = element.value.offsetWidth
  flakes.push(...new Array(options.flakeCount).fill(null).map(() => ({
    style: setStyle(random(0, elHeight), random(widthOffset.value, elWidth - widthOffset.value)),
    top: random(0, elHeight),
    left: random(widthOffset.value, elWidth - widthOffset.value),
    speed: random(options.minSpeed, options.maxSpeed),
    step: 0,
    stepSize: random(1, 10) / 100
  })
  ))
  update()
})
</script>

<template>
  <div class="heart" ref='element'>
    <div v-for=" item in flakes" :style="item.style" class="snowfall-flakes">
    </div>
  </div>
</template>

<style scoped lang="scss">
.heart {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: url("../assets/33084675_1.jpeg");
  background-position: center;
  background-size: 80%;
  background-repeat: no-repeat;
  position: relative;

  .snowfall-flakes {

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 20px;
      height: 30px;
      display: block;
      background: var(--bg);
      border-radius: 10px 10px 0 0;
    }

    &::before {
      transform: rotate(-45deg);
    }

    &::after {
      transform: rotate(45deg);
      left: 7px;
    }
  }
}
</style>
