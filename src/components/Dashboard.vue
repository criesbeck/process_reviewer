<template lang="html">
  <div class="dashboard">
    <div class="process" v-for="process in processes">
      <h3>
        <router-link class="link"
          v-bind:to="{ name: 'process', params: { id: process.id } }">
          {{process.id}}
        </router-link>
      </h3>
      <div v-for="practice in process.practices">
        {{practice.id}}: 
        {{practice.current === null ? '?' : practice.current}}
      </div>
    </div>
  </div>
</template>

<script>
  import { database } from '../firebase.js'
  import { getProcesses } from '../processes.js'

  export default {
    data() {
      return {
        processes: [],
        changes: [],
      }
    },

    firebase: { 
      changes: {
        source: database.ref('changes'),
        cancelCallback(err) {
          console.error(err);
        }
      }
    },

    created() {
      this.fetchData();
    },

    watch: {
      '$route': function () {
        this.fetchData();
      },
    },

    methods: {

      fetchData() {
        console.log('getting processes')
        getProcesses().then(processes => this.processes = processes)
      },
    },
  }
</script>

<style scoped>
  .dashboard {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    justify-content: left;
    text-align: center;
  }
  .process {
    flex-basis: 15em;
    margin: 5px;
    padding: 5px;
    text-align: left;
  }
</style>