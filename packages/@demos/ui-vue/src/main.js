import Vue from 'vue'
import App from './App.vue'
import install_apollo from './vue-apollo'
import install_router from './router'
import install_store from './store'
import install_vuetify from './vuetify'

Vue.config.productionTip = false

const config = {
  render: h => h(App),
}

install_apollo(config)
install_router(config)
install_store(config)
install_vuetify(config)

new Vue(config).$mount('#app')
