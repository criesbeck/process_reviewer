<template>
  <div id="app">
    <header>
      <h1>Process Reviewer</h1>
    </header>
    <main>
      <aside class="sidebar">
        <div v-if="user">
          <div>{{user.email}}</div>
          <button v-on:click="signOut">Sign out</button>
          <hr>
          <router-link class="link" v-bind:to="{ name: 'dashboard' }">
            Dashboard
          </router-link>
          <router-link v-for="process in processes"
            v-bind:key="process"
            active-class="is-active"
            class="link"
            v-bind:to="{ name: 'process', params: { id: process } }">
            {{process}}
          </router-link>
        </div>
      </aside>
      <div class="content" v-if="user">
        <router-view></router-view>
      </div>
      <div class="content" v-else>
        <form>
          <label>Email: <input type="text" class="user_name" id="user_id"></label>
          <label>Password: <input type="password" id="user_password"></label>
          <button v-on:click="signIn">Sign in</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
  import { firebase } from './firebase'
  import * as firebaseui from 'firebaseui' 
  import { getProcessIds } from './processes'

  export default {
    data () {
      return {
        user: null,
        processes: []
      }
    },
    
    beforeCreate() {
      firebase.auth().onAuthStateChanged(function(user) {
        this.user = user;
      }.bind(this))
    },

    created() {
      this.fetchData()
    },

    methods: {
      fetchData() {
        console.log('getting process ids')
        getProcessIds().then(ids => this.processes = ids)
      },

      signIn() {
        console.log('sign in')
        const userId = document.getElementById('user_id').value;
        const password = document.getElementById('user_password').value;
        firebase.auth()
          .signInWithEmailAndPassword(userId, password)
          .catch(function(error) {
            console.log(error);
          });
      },

      signOut() {
        firebase.auth().signOut();
      },
    },

  }
</script>

<style>
  body {
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  header {
    position: fixed;
    top: 0;
    width: 100%;
    min-height: 90px;
    border-bottom: 1px solid #42b983;
    text-align: center;
    background: #ffffff;
  }
  main {
    display: flex;
    height: calc(100vh - 90px);
    max-width: 1200px;
    margin-top: 90px;
    margin-left: auto;
    margin-right: auto;
  }
  aside {
    flex: 1 0 20%;
    height: 100%;
    overflow-y: auto;
    width: 20%;
    padding: 50px 30px;
    box-sizing: border-box;
    border-right: 1px solid #42b983;
  }
  .content {
    flex: 1 1 80%;
    display: flex;
    align-items: start;
    justify-content: center;
  }
  .link {
    display: block;
    text-decoration: none;
    text-transform: capitalize;
    margin-bottom: 10px;
    color: #2c3e50;
  }
  .user_name {
    width: 20em;
  }
</style>