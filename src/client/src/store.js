import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import { defaultClient as apolloClient } from "./main";

import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    error: null,
    user: null,
    posts: [],
    loading: false
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    claerUser: state => {
      state.user = null;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    claerError: state => {
      state.error = null;
    }
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          console.log(data.getCurrentUser);
          commit("setUser", data.getCurrentUser);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit("claerError");
      commit("setLoading", true);
      localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          // to make sure created method is run in main.js (we run getCurrentUser) reload the page
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.log(err);
        });
    },
    signoutUser: async ({ commit }) => {
      //clear user in state
      commit("claerUser");
      //remove token in localstorage
      localStorage.setItem("token", "");
      //end session
      await apolloClient.resetStore();
      //redirect home - kick user out of private pages
      router.push("/signin");
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading,
    user: state => state.user,
    error: state => state.error
  }
});
