let processData = null;

function makeOptionLabels(optionString) {
  return (optionString.startsWith('eg:'))
    ? optionString.slice(3).split(',').map(str => str.trim())
    : [];
}

function makeOptionObject(label) {
  return { label: label, inUse: false, pros: "", cons: "" };
}

function makeOptionList(optionString) {
  return makeOptionLabels(optionString).map(makeOptionObject);
}

function makeProcess(id, obj) {
  return {
    id: id,
    practices: Object.keys(obj).map(practice => ({
      id: practice, 
      options: makeOptionList(obj[practice])
    }))
  }
}

function makeProcessData(json) {
  const ids = Object.keys(json.processes);
  const index = ids.reduce((index, id) => (
      index[id] = makeProcess(id, json.processes[id]),
      index
    ), {});
  return { ids, index, processes: ids.map(id => index[id])};
}

function fetchProcessData() {
  console.log('fetch called')
  return fetch('/processes.json')
    .then(response => response.json())
    .then(json => {
       processData = makeProcessData(json);
       console.log('fetch done')
       return true;
    })
    .catch(error => {
      console.log('-----error-------');
      console.log(error);
    })
}

export function getProcessIds() {
  console.log('process ids called')
  return (processData) ? Promise.resolve(processData.ids) 
    : fetchProcessData().then(() => processData.ids)
}

export function getProcesses() {
  console.log('processes called')
  return (processData) ? Promise.resolve(processData.processes) 
  : fetchProcessData().then(() => processData.processes);
}

export function getProcess(id) {
  console.log('process ' + id)
  return (processData) ? Promise.resolve(processData.index[id]) 
  : fetchProcessData().then(() => processData.index[id]);
}
