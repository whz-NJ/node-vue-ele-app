import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const types = {
    SET_IS_AUTHENTIATED: "SET_IS_AUTHENTIATED",
    SET_USER: "SET_USER"
};

const state = {
    isAthenticated: false,
    user: {

    }
};
const getters = {
    isAthenticated: state => state.isAthenticated,
    user: state => state.user
};
const mutations = {
  [types.SET_IS_AUTHENTIATED](state, isAthenticated) {
    if(isAthenticated) state.isAthenticated = isAthenticated;
    else state.isAthenticated = false;
  },
  [types.SET_USER](state, user) {
    if(user) state.user = user;
    else state.user = {};
  }
};

//异步操作的actions
const actions = {
    setIsAuthenticated: ({commit}, isAthenticated) => {
   commit(types.SET_IS_AUTHENTIATED, isAthenticated);
 },
    setUser: ({commit}, user) => {
   commit(types.SET_USER, user);
    },
    clearCurrentState: ({ commit }) => {
        commit(types.SET_IS_AUTHENTIATED, false)
        commit(types.SET_USER, null)
    }
};
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
