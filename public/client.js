const questionDiv = document.getElementById('questionDiv')
const choiceDiv = document.getElementById('choiceDiv')
const leftOptionDiv = document.getElementById('leftOptionDiv')
const rightOptionDiv = document.getElementById('rightOptionDiv')
const rankTable = document.getElementById('rankTable')
const nitems = 7
const labels = [
  'Schindler\'s List',
  'The Silence of the Lambs',
  'Goodfellas',
  'Back to the Future',
  'Once Upon a Time in America',
  'Amadeus',
  'Scarface',
  'Raiders of the Lost Ark',
  'Das Boot',
  'The Shawshank Redemption',
  'Pulp Fiction',
  'Forrest Gump',
  'The Lion King',
  'Saving Private Ryan',
  'Gladiator',
  'Memento',
  'Fight Club',
  'The Matrix',
  'The Green Mile'
]

function range (n) { return [...Array(n).keys()] }
function getShuffled (array) {
  const indices = range(array.length)
  const randoms = indices.map(i => Math.random())
  indices.sort((i, j) => randoms[i] - randoms[j])
  return indices.map(i => array[i])
}
function getRandElement (array) {
  return array[Math.floor(Math.random() * array.length)]
}

const shuffledLabels = getShuffled(labels).slice(0, nitems)
const items = range(nitems).map(i => ({
  label: shuffledLabels[i],
  score: 0
}))

function updateRankTable () {
  rankTable.innerHTML = ''
  items.forEach(item => {
    const row = rankTable.insertRow()
    row.insertCell().textContent = item.label
    row.insertCell().textContent = item.score
  })
}
updateRankTable()

let blocks = items.map(item => [item])
function getOperations (blocks) {
  const operations = []
  while (blocks.length > 1) {
    const blockA = blocks.pop()
    const blockB = blocks.pop()
    operations.unshift({
      input: [blockA, blockB],
      output: [],
      steps: blockA.length + blockB.length - 1
    })
  }
  if (blocks.length === 1) {
    operations.push({
      input: [[], []],
      output: blocks.pop(),
      steps: 0
    })
  }
  return operations
}
let operations = getOperations(blocks)

let maxSteps = Math.max(...operations.map(operation => operation.steps))
function chooseOperation (operations) {
  const maximalOperations = operations.filter(operation => operation.steps === maxSteps)
  return getRandElement(maximalOperations)
}
let currentOperation = chooseOperation(operations)

const options = []
let leftIndex = 0
let rightIndex = 1
function setupChoice () {
  currentOperation = chooseOperation(operations)
  options[0] = currentOperation.input[0][0]
  options[1] = currentOperation.input[1][0]
  leftIndex = getRandElement([0, 1])
  rightIndex = 1 - leftIndex
  leftOptionDiv.innerHTML = options[leftIndex].label
  rightOptionDiv.innerHTML = options[rightIndex].label
}
setupChoice()

function chooseOption (choice) {
  const chosen = currentOperation.input[choice].shift()
  currentOperation.output.push(chosen)
  chosen.score = currentOperation.steps
  currentOperation.steps -= 1
  if (currentOperation.input[choice].length === 0) {
    currentOperation.output.push(...currentOperation.input[1 - choice])
    currentOperation.input[1 - choice] = []
    currentOperation.steps = 0
  }
  items.sort((a, b) => b.score - a.score)
  updateRankTable()
  maxSteps = Math.max(...operations.map(operation => operation.steps))
  if (maxSteps > 0) setupChoice()
  else {
    blocks = operations.map(operation => operation.output)
    operations = getOperations(blocks)
    maxSteps = Math.max(...operations.map(operation => operation.steps))
    if (maxSteps > 0) setupChoice()
    else finalize()
  }
}

let finalized = false
function finalize () {
  finalized = true
  choiceDiv.innerHTML = ''
  questionDiv.innerHTML = 'Final Scores:'
}

document.onkeydown = function (event) {
  if (event.key === ' ') {
    logOperations()
  }
  if (finalized) return
  if (event.key === 'ArrowLeft') {
    console.log(`${options[leftIndex].label} > ${options[rightIndex].label}`)
    chooseOption(leftIndex)
  }
  if (event.key === 'ArrowRight') {
    console.log(`${options[rightIndex].label} > ${options[leftIndex].label}`)
    chooseOption(rightIndex)
  }
}

function logOperations () {
  operations.forEach(operation => {
    console.log(`operation steps: ${operation.steps}`)
    console.log(operation.input[0].map(x => x.label))
    console.log(operation.input[1].map(x => x.label))
    console.log(operation.output.map(x => x.label))
  })
}
