import { FourierCircleSVGParser } from './lib/parser'
import { FourierCircleRenderer } from './lib/renderer'

const runBtn = document.getElementById('run')
const saveBtn = document.getElementById('save')
const playBtn = document.getElementById('play')
const pathTextarea = document.getElementById('path')

function activePlayBtn() {
  playBtn.removeAttribute('disabled')
  playBtn.addEventListener('click', () => {
    if (playBtn.innerText == 'Pause') {
      renderer.pause()
      playBtn.innerText = 'Play'
    } else {
      renderer.play()
      playBtn.innerText = 'Pause'
    }
  })
}

const canvas = document.getElementById('canvas')
const renderer = new FourierCircleRenderer(canvas.getContext('2d'), canvas.height, canvas.width)

runBtn.addEventListener('click', () => {
  const svgPath = pathTextarea.innerHTML
  const time = Date.now()
  runBtn.setAttribute('disabled', 'disabled')
  new FourierCircleSVGParser(svgPath, (data) => {
    runBtn.innerText = `Done! ${(Date.now() - time) / 1000}s`
    renderer.load(data)
    activePlayBtn()
    saveBtn.removeAttribute('disabled')
  }, {
    process: (p) => {
      runBtn.innerText = `${(p * 100).toFixed(2)}%`
    }
  })
})

saveBtn.addEventListener('click', () => {
  localStorage.setItem('result', JSON.stringify(renderer.data))
  saveBtn.setAttribute('disabled', 'disabled')
})

const saveData = localStorage.getItem('result')

if (saveData) {
  try {
    const parsedData = JSON.parse(saveData)
    if (parsedData.length) {
      renderer.load(parsedData)
      activePlayBtn()
    }
  } catch (e) {}
}