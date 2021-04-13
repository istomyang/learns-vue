<template>
  <div class="svg-icon">
    <svg
      :width="width"
      :height="height"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>setting_icon</title>
      <desc>Design by: https://gallery.flutter.dev/#/</desc>

      <!-- 线形渐变 -->
      <defs>
        <linearGradient id="Gradient1">
          <stop offset="0%" stop-color="#ff7d86" />
          <stop offset="100%" stop-color="#ff5f85" />
        </linearGradient>
        <linearGradient id="Gradient2">
          <stop offset="0%" stop-color="#00dac7" />
          <stop offset="100%" stop-color="#00a7b1" />
        </linearGradient>
      </defs>

      <!-- 上杆,彩色部分 -->
      <rect
        x="8"
        y="25"
        width="82"
        height="18"
        rx="9"
        fill="url(#Gradient1)"
        transform="scale(-1 1) translate(-98 0)"
        class="up-bar-color"
        :class="{ ison: isOn, isoff: isOff }"
      />

      <!-- 上杆, 黑色部分 -->
      <rect
        x="10"
        y="27"
        width="14"
        height="14"
        rx="7"
        ry="7"
        fill="black"
        class="up-bar-black"
        :class="{ ison: isOn, isoff: isOff }"
      ></rect>

      <!-- 下杆, 彩色部分 -->
      <rect
        x="8"
        y="57"
        width="82"
        height="18"
        rx="9"
        fill="url(#Gradient2)"
        class="down-bar-color"
        :class="{ ison: isOn, isoff: isOff }"
      />

      <!-- 下杆,黑色 -->
      <rect
        x="10"
        y="59"
        width="14"
        height="14"
        rx="7"
        ry="7"
        fill="black"
        class="down-bar-black"
        :class="{ ison: isOn, isoff: isOff }"
      />
    </svg>
  </div>
</template>

<script>
// 控制父级的设置打开句柄
export default {
  data() {
    return {
      isOn: false,
      isOff: true,
    }
  },
  props: {
    height: {
      type: Number,
      default: 32,
    },
    width: {
      type: Number,
      default: 32,
    },
    isopen: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isopen(val) {
      this.isOff = !val
      this.isOn = val
    },
  },
}
</script>

<style scoped>
.up-bar-color.isoff {
  /* 提前渲染BUG */
  visibility: hidden;
  /* 延迟一秒 */
  animation: up-bar-color-off 0.25s ease 0.25s 1 normal forwards;
}

.up-bar-color.ison {
  animation: up-bar-color-on 0.25s ease 0s 1 normal forwards;
}

@keyframes up-bar-color-on {
  0% {
    width: 82px;
  }
  5% {
    width: 80px;
  }
  80% {
    opacity: 1;
  }
  100% {
    width: 18px;
    opacity: 0;
  }
}

@keyframes up-bar-color-off {
  0% {
    opacity: 0;
    width: 18px;
    visibility: visible;
  }
  20% {
    opacity: 1;
    visibility: visible;
  }
  95% {
    width: 80px;
    visibility: visible;
  }
  100% {
    width: 82px;
    visibility: visible;
  }
}
.up-bar-black {
  /* 始终固定旋转点, 否则可能无法归位 */
  transform-origin: 49px 34px;
}
.up-bar-black.isoff {
  animation: up-bar-black-off 0.5s ease 0s 1 normal forwards;
}
.up-bar-black.ison {
  animation: up-bar-black-on 0.5s ease 0s 1 normal forwards;
}
@keyframes up-bar-black-on {
  0% {
    width: 14px;
  }
  50% {
    width: 78px;
    transform: translateY(0px) rotate(0deg);
  }
  100% {
    width: 78px;
    transform: translateY(16px) rotate(45deg);
  }
}
@keyframes up-bar-black-off {
  0% {
    transform: translateY(16px) rotate(45deg);
    width: 78px;
  }
  50% {
    transform: translateY(0px) rotate(0deg);
    width: 78px;
  }
  100% {
    width: 14px;
  }
}

/* 下杆, 彩色 */
.down-bar-color.isoff {
  /* 提前渲染BUG */
  visibility: hidden;
  animation: down-bar-color-off 0.25s ease 0.25s 1 normal forwards;
}

.down-bar-color.ison {
  animation: down-bar-color-on 0.25s ease 0s 1 normal forwards;
}

@keyframes down-bar-color-on {
  0% {
    width: 82px;
  }
  5% {
    width: 82px;
  }
  80% {
    opacity: 1;
  }
  100% {
    width: 18px;
    opacity: 0;
  }
}

@keyframes down-bar-color-off {
  0% {
    opacity: 0;
    width: 18px;
    visibility: visible;
  }
  20% {
    opacity: 1;
    visibility: visible;
  }
  95% {
    width: 82px;
    visibility: visible;
  }
  100% {
    width: 82px;
    visibility: visible;
  }
}

.down-bar-black {
  /* 原本SVG中进行变换, 但使用相同的旋转点, 所以在css变换 */
  transform-origin: 49px 66px;
  transform: scaleX(-1);
}

.down-bar-black.isoff {
  animation: down-bar-black-off 0.5s ease 0s 1 normal forwards;
}
.down-bar-black.ison {
  animation: down-bar-black-on 0.5s ease 0s 1 normal forwards;
}
@keyframes down-bar-black-on {
  0% {
    width: 14px;
  }
  50% {
    width: 78px;
    /* 变换必须所有一起 */
    transform: scaleX(-1) translateY(0px) rotate(0deg);
  }
  100% {
    width: 78px;
    transform: scaleX(-1) translateY(-16px) rotate(45deg);
  }
}
@keyframes down-bar-black-off {
  0% {
    transform: scaleX(-1) translateY(-16px) rotate(45deg);
    width: 78px;
  }
  50% {
    transform: scaleX(-1) translateY(0px) rotate(0deg);
    width: 78px;
  }
  100% {
    width: 14px;
  }
}
</style>