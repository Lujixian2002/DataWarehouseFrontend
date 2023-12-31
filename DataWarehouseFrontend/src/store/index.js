import { createStore } from 'vuex'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})


// import { login } from '@/api/login'
// import { defineStore } from "pinia";
// import { toRaw } from '@vue/reactivity'
// import { ref } from 'vue'



// const useUserStore2 = defineStore("token", {
//   state: () => {
//     return {
//       token:{}
//     };
//   },
//   getters: {
    
//   },
//   actions: {
//     increment() {
//        this.count++
//     },
//     async loadUserList(params){
//         const res = await login(params)
//         this.token=res.data[0]
//         console.log('uss')
//         console.log(this.token)
//     },
//     clearUserInfo() {
//       this.token={}
//     }
//   },

// });
 