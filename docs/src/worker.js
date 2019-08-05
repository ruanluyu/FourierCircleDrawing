import math from 'mathjs'
import * as utils from './lib/utils'

self.addEventListener('message', function (event) {
  const { s, curWeight, points, workerId } = event.data

  let m = 0

  if (s > 0) {
    m = math.floor((s + 1) / 2) * (s % 2 == 0 ? -1 : 1)
  }

  let sum = math.complex(0, 0)
  for (let i = 0; i < points.length; ++i) {
    let cs = utils.linear(curWeight[i], 0, 1, 0, math.pi * 2)
    let ce = utils.linear(curWeight[i + 1], 0, 1, 0, math.pi * 2)
    sum = math.add(sum, utils.numSolve(m, cs, ce, points[i]))
  }

  const response = {
    s,
    workerId,
    clst: utils.cpToList(sum)
  }

  self.postMessage(response)
}, false)