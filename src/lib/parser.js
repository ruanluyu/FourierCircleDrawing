import {
  parseSVG,
  makeAbsolute
} from 'svg-path-parser'
import math from 'mathjs'
import {
  bezier,
  linear
} from './utils'

export class FourierCircleSVGParser {
  constructor(path, cb, {
    center = [500, 500],
    steps = 1000,
    thread = 32,
    process = null
  } = {}) {
    this.path = path
    this.steps = steps
    this.points = []
    this.thread = thread
    this.cb = cb
    this.process = process

    const parsedPath = makeAbsolute(parseSVG(path))
    for (let i in parsedPath) {
      const action = parsedPath[i]
      let p0, p1, p2, p3, lastp2
      switch (action.code) {
        case 'C':
          this.points.push([
            math.complex(action.x0, action.y0),
            math.complex(action.x1, action.y1),
            math.complex(action.x2, action.y2),
            math.complex(action.x, action.y),
          ]);
          break;
        case 'S': //Changed here -by ZzStarSound
          p0 = math.complex(action.x0, action.y0)
          p2 = math.complex(action.x2, action.y2)
          p3 = math.complex(action.x, action.y)
          lastp2 = math.complex(parsedPath[i - 1].x2, parsedPath[i - 1].y2)
          this.points.push([
            p0,
            math.subtract(math.multiply(2, p0), lastp2),
            p2,
            p3,
          ]);
          break;
        case 'L': //Changed here -by ZzStarSound
          p0 = math.complex(action.x0, action.y0)
          p3 = math.complex(action.x, action.y)
          p1 = math.add(math.multiply(2 / 3, p0), math.multiply(1 / 3, p3))
          p2 = math.add(math.multiply(1 / 3, p0), math.multiply(2 / 3, p3))
          this.points.push([
            p0,
            p1,
            p2,
            p3,
          ]);
          break;
        case 'V': //Changed here -by ZzStarSound
          p0 = math.complex(action.x0, action.y0)
          p3 = math.complex(action.x0, action.y)
          p1 = math.add(math.multiply(2 / 3, p0), math.multiply(1 / 3, p3))
          p2 = math.add(math.multiply(1 / 3, p0), math.multiply(2 / 3, p3))
          this.points.push([
            p0,
            p1,
            p2,
            p3,
          ]);
          break;
        case 'H': //Changed here -by ZzStarSound
          p0 = math.complex(action.x0, action.y0)
          p3 = math.complex(action.x, action.y0)
          p1 = math.add(math.multiply(2 / 3, p0), math.multiply(1 / 3, p3))
          p2 = math.add(math.multiply(1 / 3, p0), math.multiply(2 / 3, p3))
          this.points.push([
            p0,
            p1,
            p2,
            p3,
          ]);
          break;
      }
    }

    this.points = this.points.map((ps) => {
      return ps.map((p) => math.subtract(p, math.complex(...center)))
    })

    let wsum = 0
    this.curWeight = []
    // Calculate weight
    for (let c in this.points) {
      const curve = this.points[c]
      let wst = 10 // steps
      let sum = 0
      for (let i = 1; i < wst; ++i) {
        sum = math.add(sum, math.abs(
          math.subtract(
            bezier(linear(i, 0, wst, 0, 1), curve[0], curve[1], curve[2], curve[3]),
            bezier(linear(i - 1, 0, wst, 0, 1), curve[0], curve[1], curve[2], curve[3])
          )
        ))
      }
      this.curWeight.push(sum)
      wsum = math.add(wsum, sum)
    }

    for (let i = 0; i < this.curWeight.length; ++i) {
      this.curWeight[i] = math.divide(this.curWeight[i], wsum)
    }

    for (let i = 1; i < this.curWeight.length; ++i) {
      this.curWeight[i] = math.add(this.curWeight[i], this.curWeight[i - 1])
    }

    this.curWeight.unshift(0)
    this.curWeight[this.curWeight.length - 1] = 1
    this.startWorker()
  }

  startWorker() {
    this.dataArray = new Array(this.steps)
    this.pool = {}
    this.running = []
    this.pending = []
    this.stepCount = 0
    this.taskFinish = 0
    for (let i = 0; i < this.thread; ++i) {
      this.pool[i] = new Worker('../worker.js')
      this.pool[i].addEventListener('message', this.onWorkerMessage.bind(this), false)
      this.pending.push(i)
    }
    for (let i = 0; i < this.thread; ++i) {
      this.doTask()
    }
  }

  doTask() {
    const workerId = this.pending.shift()
    if (!workerId) return
    if (this.stepCount >= this.steps) return
    this.pool[workerId].postMessage({
      s: this.stepCount++,
      curWeight: this.curWeight,
      points: this.points,
      workerId
    })
    this.pending.splice(this.pending.indexOf(workerId), 1)
    this.running.push(workerId)
  }

  onWorkerMessage(event) {
    const {
      s,
      workerId,
      clst
    } = event.data
    this.dataArray[s] = clst
    this.running.splice(this.running.indexOf(workerId), 1)
    this.pending.push(workerId)
    this.taskFinish++
    if (this.process) {
      this.process(this.stepCount / this.steps)
    }
    if (this.taskFinish >= this.steps) {
      this.cb(this.dataArray)
      return
    }
    this.doTask()
  }
}