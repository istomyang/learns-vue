export default {
  name: 'github',
  namespaced: true,
  state: {
    // Users in Back-end have initialize data
    usersHasData: [],
    currentUserName: '',
  },
  getters: {
    hasInUsersHasData(state) {
      return username => state.usersHasData.some(u => u === username)
    },
  },
  mutations: {
    addUsersHasData(state, data) {
      if (Array.isArray(data)) {
        state.usersHasData.push(...data)
      } else {
        state.usersHasData.push(data)
      }
    },
    updateCurrentUser(state, name) {
      state.currentUserName = name
    },
  },
}
