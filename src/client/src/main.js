import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

Vue.use(VueApollo);

// Setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  //include auth token with request we made to backend
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    //if no token with key of token in localStorage, add it
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }

    // operation adds the token an authorization header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkErrors }) => {
    if (networkErrors) {
      console.error("[NetworkErrors]:", networkErrors);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.error(err);
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  apolloProvider: apolloProvider,
  router,
  store,
  render: h => h(App),
  created() {
    //execute getcurrentUser query
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
