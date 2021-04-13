<template>
  <div>
    <!-- 
      + v-bind 是绑定数据，用来对元素属性动态赋值。
      + title 是标签元素全局属性。
      + {{ }} 是文本插值，可运行JS单个表达式，并且只能访问特定全局变量 ，
        https://github.com/vuejs/vue/blob/v2.6.10/src/core/instance/proxy.js#L9。
      + v-once 一次性插值，不改变。
      + html插值谨慎XSS攻击。
      + 动态绑定，全部小写的约束，不能有表达式
     -->
    <h1 v-bind:title="message">{{ name + message }}</h1>
    <p v-if="false" v-once>{{ name }}</p>
    <p v-if="false" v-html="rawhtml"></p>
    <p v-if="false" :[dynamicattr]="rawhtml"></p>

    <!-- if and for -->
    <div>
      <p v-if="isShow">现在看到我了</p>
      <button v-bind:value="isShow ? '隐藏' : '显示'"></button>

      <ol>
        <!-- 
          li 可以进一步封装，然后通过prop传递todo对象
          key 为了提高渲染性能用，父级唯一就行
         -->
        <li v-for="todo in todos" v-bind:key="todo.text">
          {{ todo.text }}
        </li>
      </ol>
    </div>

    <!-- 
      事件监听 修饰符
      双向绑定：可以在UI层修改数据
     -->
    <div>
      <p>{{ message }}</p>
      <button v-on:click.prevent="reverseMessage">反转消息</button>
      <input type="text" v-model="message" />
    </div>

    <!-- 
      非定义prop绑定
     -->
    <div v-bind="$attrs">非定义的props在这儿</div>
  </div>
</template>

<script>
/**
 * 组件
 * + 类似于flutter，对某个单个功能块进行组件化。
 * + prop 提供组件树的单向向下传递
 * + Vue的组件参考了Web组件规范，但提供了比此更好的功能。
 * + 如果想获取this，必须使用 function(){} 无论哪个选项。
 *
 *
 * Vuejs有很多细节的知识点：
 * +
 */

export default {
  // 函数，需要this绑定的函数，维护独立拷贝
  // 一份widget，对应很多element，如果使用对象形式，可以在该组件群内共享数据。
  data: function () {
    return {
      message: 'Hey, Vue!',
      isShow: false,
      todos: [
        { text: '学习 JavaScript' },
        { text: '学习 Vue' },
        { text: '整个牛项目' },
      ],
      rawhtml:`<div/>`
    }
  },

  /**
   * Props
   * 父到子，单项数据流
   *
   * html中使用，需要变成 kabel-case
   * 如果使用字符串模板，就不需要
   * props有很多形式上的功能，用来验证数据
   *
   * 不要试图更改 prop，因为JS语言传递引用，如果非要更改，请属于其他比如data和computed
   *
   * 特例：
   * 父传递的prop在子组件没有定义：使用 inheritAttrs: false 和 $attrs 绑定到特有的标签上
   *
   * https://cn.vuejs.org/v2/guide/components-props.html
   */
  props: {
    // 验证类型
    // 必填字段、默认字段、多个类型、自定义验证函数、类型还可以是对象
    // https://cn.vuejs.org/v2/guide/components-props.html#Prop-%E9%AA%8C%E8%AF%81
    // 注意：prop验证在实例化之前，所以this不可用⛔。
    name: String,
  },
  inheritAttrs: false,

  /**
   * 计算属性
   * 特点在于会缓存相同的结果【提取参数，如果一样，返回结果，但如果函数内部有Date()
   * 这样的语句，则不会改变。】
   *
   */
  computed: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    },

    // 计算属性一般只能gettter，如果需要可以提供。
    haveGetterAndSetter:{
      get: function(){},
      set: function(){}
    }
  },

  /**
   * 侦听属性
   * 用于处理数据依赖。
   */
  watch: {
    // 参数是一定的
    // https://cn.vuejs.org/v2/api/#watch
    a: function(newVal, oldVal){}
  },

  // 生命周期钩子
  // https://cn.vuejs.org/images/lifecycle.png
  created: function () {
    // this === 当前vm实例
    const that = this
  },
}
</script>

<style></style>
