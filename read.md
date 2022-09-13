# 前言

很久没有输出文章了， 趁着活动，水一篇吧，整点劲大的，毕竟`大力出奇迹`

近来，在研究在线IDE颇有收获，打算写个专栏文章， [手摸手打造类码上掘金在线IDE](https://juejin.cn/column/7140983370984456228) ,有兴趣的`jym` 可以关注动态，后续会有更多的文章

#  研究课题

既然是码上掘金秀代码，那怎么能没有动效呢？ 

那么问题来了，什么是好的动效呢？ 

得够花哨，得能拓展， 实现得简单，还得能百搭

于是想起了当年JQ时代盛行的一招从天而降的动效- 漫天心，经过几天研究，我给他用`vue3` 重写了

重要的不是特效，而是重写过程中反映出来的实现思路，期望给各位`jym` 在开发的道路上打开格局，open 起来

# vue3思路 vs jq时代思路

我们知道在jq时代大家想要实现动效，除了css3的有限效果之外，最主要的手段就是操作DOM

**例如:我们先要实现方块来回移动**


使用传统的`js思路`如下：
```js
// html
<div id="box"></div>
// css
   #box{
            width:200px;
            height:200px;
            background:indianred;
            position:absolute;
            left:0;
    }
// js
 var box = document.getElementById("box");
        var num = 0;
        var speen = 1
        function setNum() {
            if (num > 1200) { speen = -1 }
            if (num < 0) { speen = 1 }
            num += speen;
            box.style.left = num + 'px'

        }
        setInterval(setNum, 1)
           

```
代码如上，我们只需要启动定时器，频繁的操作box改变left的值，就能实现方块来回移动，大家发现他麻烦，一旦是大型的动效，可能实现起来摸不着头脑，因为dom太多，我们很容易操作混乱

[码上掘金代码](https://code.juejin.cn/pen/7142694395223998501)


而到了，react vue大行其道的年代，  他们提出了数据驱动视图的概念，dom 更新的复杂操作，交给框架， 我们只需要改变元数据，思路就会变得特别清晰

拿vue3的实现方式举例，代码如下

```js
<template>
  <div id="box" :style="{left:`${num}px`}"></div>
</template>
 
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const num = ref(0);
    let  speen = 1
    function  setNum(){
       if (num.value > 1200) { speen = -1 }
       if (num.value < 0) { speen = 1 }
        num.value += speen;
    }
    setInterval(setNum, 1)
    return {
      num
    };
  },
});
</script>

<style>
 #box{
            width:200px;
            height:200px;
            background:indianred;
            position:absolute;
            left:0;
        }
</style>
      
```

在vue3 中我们只需要对num的值做改变就能实现同样的效果

[码上掘金代码](https://code.juejin.cn/pen/7142698431717310501)

有人就问了，你这不就少了一行代码吗？ 

这能凸显怎么能凸显数据驱动视图的威力呢？

你吹牛x吧

 别急，一个的移动我们加了一行代码，那一屏幕的动效在动呢？


此时此刻通过操作dom 如果没有封装的功底，你可能就摸不着头脑了吧

然而使用vue3通过数据的改变， 来自动的驱动视图的变化，思路就很清晰了，简化了我们dom操作的复杂度

从而降低了实现的门槛

# 实现思路

[码上掘金代码](https://code.juejin.cn/pen/7140613967931506701)

我们前面说过，得够花哨，得能拓展， 实现得简单，还得能百搭

花哨自不用说， 效果还凑活


能拓展指的是我们不但要能飘心，还要能飘星


## 实现飘心

总体思路就是两个长方形变换角度之后增加圆角

代码如下 ：
```css
 .snowfall-flakes {

      &::before,
      &::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 30px;
        display: block;
        background: red;
         : 10px 10px 0 0;
      }

      &::before {
        transform: rotate(-45deg);
      }

      &::after {
        transform: rotate(45deg);
        left: 7px;
      }
    }
```

如果想要拓展，只需将当前的div 标签更换背景，或者改变效果即可

## 实现方式
由于vue3的加持，整体实现思路非常简单整体代码如下：

```js
<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  
import { computed, reactive, ref, onMounted } from 'vue'
interface Option {
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
interface Flakes {
    style: CSSProperties,
    speed: number,
    top: number,
    left: number,
    stepSize: number,
    step: number
}
 const random = function random(min: number, max: number) {
    return Math.round(min + Math.random() * (max - min));
}
 const defaults: Option = {
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
```


### 动画实现原理-requestAnimationFrame

 requestAnimationFrame 想必很多人都很熟悉

`!使用它告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行`

`这个函数对比定时器的好处，就是按照一定的频率一帧一帧的绘制的， 而不是一次性的绘制，这样就不会出现卡顿的情况。`

### 初始化心形对象元数据

```js
const heart = {
    // 初始化style样式
    style: setStyle(random(0, elHeight), random(widthOffset.value, elWidth - widthOffset.value)),
    //  实时的top值，left值
    top: random(0, elHeight),
    left: random(widthOffset.value, elWidth - widthOffset.value),
    //top值的增量
    speed: random(options.minSpeed, options.maxSpeed),
    //为了求左右摇摆幅度
    step: 0,
     // left步长
    stepSize: random(1, 10) / 100
  }
```

### 利用requestAnimationFrame 实现动画

```js
// 重置样式
const reset = (item) => {
  item.left = random(widthOffset.value, elWidth - widthOffset.value);
  item.top = 0;
  item.speed = random(options.minSpeed, options.maxSpeed);
  item.stepSize = random(1, 10) / 100;
}

// 更新函数
const update = () => {
  // 更新函数改变心形数据
  flakes.forEach((item) => {
    item.top += item.speed;
    // 如果到底部了，从顶部从新开始
    if (item.top > elHeight) {
      reset(item)
    }
    // 求出摇摆幅度，形成飘落效果
    item.step += item.stepSize;
    item.left += Math.cos(item.step);
    // 赋值样式
    item.style = setStyle(item.top, item.left)
  })
  // 下一帧继续执行
  snowTimeout = requestAnimationFrame(function () { update() });
}
```

好了，基本的实现方式介绍完成了，是不是很简单，那百搭呢？

更换背景就可以了啊，母情节能用，情人节能用，七夕节也能用，教师节也能用







 