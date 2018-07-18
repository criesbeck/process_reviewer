<template lang="html">
  <div class="process" v-if="process">
    <h1 class="process-id">{{ process.id }}</h1>
    
    <div class="dashboard">
      <div class="practice" 
        v-for="practice in process.practices"
        v-bind:key="practice.id"
        v-on:click="toggleOption(practice, $event)">
          <h3>
            {{practice.id}}
          </h3>

          <h4>Doing</h4>

          <ul>
            <li class="option" v-for="option in optionsInUse(practice)">
                {{ option.label }}
            </li>
          </ul>

          <h4>Not Doing</h4>

          <ul>
            <li class="option" v-for="option in optionsNotInUse(practice)">
                {{ option.label }}
            </li>
          </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { database } from '../firebase.js'
  import { getProcess } from '../processes.js'

  export default {
    props: ['id'],

    data () {
      return {
        process: null,
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
      this.fetchData()
    },

    watch: {
      '$route': function () {
        this.fetchData();
      },
    },

    methods: {

      fetchData() {
        console.log('getting process ' + this.is)
        getProcess(this.id).then(process => this.process = process)
      },
      
      optionsInUse(practice) {
        return practice.options.filter(option => this.inUse(practice, option))
      },

      optionsNotInUse(practice) {
        return practice.options.filter(option => !this.inUse(practice, option));
      },

      inUse(practice, option) {
        return this.changeSummary[practice.id]
          && this.changeSummary[practice.id][option.label]
          && this.changeSummary[practice.id][option.label].inUse;
      },

      toggleOptionUse(practice, label) {
        practice.options.forEach(option => {
          if (option.label === label) {
            this.$set(option, 'inUse',  !option.inUse);
            this.$firebaseRefs['changes'].push({
              time: Date.now(),
              process: process.id,
              practice: practice.id,
              option: option.label,
              inUse: option.inUse,
            })
          }
        })
      },

      toggleOption(practice, event) {
        const target = event.target;
        if (target.classList.contains('option')) {
          event.stopPropagation();
          this.toggleOptionUse(practice, target.innerText);
        }
      },

      forceKey(obj, key) {
        if (!obj.hasOwnProperty(key)) {
          obj[key] = {};
        }
        return obj[key];
      },

      forceKeys(obj, ...keys) {
        return keys.reduce(this.forceKey, obj);
      },

      mergeChange(changeObj, change) {
        this.forceKeys(changeObj, change.practice, change.option).inUse = change.inUse;
        console.log(change.time + ': ' + change.practice + ' ' + change.option + ' = ' + change.inUse)
        return changeObj;
      },

      mergeChanges() {
        return Array.from(this.changes)
          .sort((c1, c2) => c1.time - c2.time)
          .reduce(this.mergeChange, {});
      }
    },

    computed: {
      changeSummary: function() {
        return this.mergeChanges();
      },
      foo: function() { return Date.now(); }
    },

  }
</script>

<style scoped>
  .dashboard {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: left;
    text-align: center;
  }
  .practice {
    flex-basis: 15em;
    margin: 5px;
    padding: 5px;
    text-align: left;
  }
</style>