import math from 'mathjs'
export const oneOver2PI = 1 / (math.pi * 2)

/**
 * 贝塞尔函数（估测长度用）
 */
export function bezier(t, a, b, c, d) {
  return math.add(
    math.multiply(
      math.add(
        math.subtract(
          math.add(
            math.subtract(0, a),
            math.multiply(3, b)
          ),
          math.multiply(3, c)
        ),
        d)
      ,
      t, t, t
    ),
    math.multiply(
      3,
      math.add(
        math.subtract(
          a,
          math.multiply(2, b)
        ),
        c
      ),
      t, t
    ),
    math.multiply(
      3,
      math.add(math.subtract(0, a), b),
      t
    ),
    a
  )
}

/**
 * 映射函数
 */
export function linear(x, a, b, c, d) {
  return math.add(
    math.multiply(
      math.divide(
        math.subtract(x, a),
        math.subtract(b, a)
      ),
      math.subtract(d, c)
    ),
    c
  )
}

export function prSolve(m, cs, ce, n) {
  if (math.equal(m, 0)) {
    return math.divide(math.multiply(math.subtract(ce, cs), oneOver2PI), math.add(n, 1))
  }
  if (math.equal(n, 0)) {
    return math.multiply(
      math.divide(
        math.multiply(
          math.i,
          oneOver2PI
        ),
        m
      ),
      math.subtract(
        math.exp(math.multiply(math.subtract(0, m), math.i, ce)),
        math.exp(math.multiply(math.subtract(0, m), math.i, cs))
      )
    )
  } else if (math.larger(n, 0)) {
    return math.subtract(
      math.multiply(
        math.divide(
          math.multiply(
            math.i,
            oneOver2PI
          ),
          m
        ),
        math.exp(
          math.multiply(math.subtract(0, m), math.i, ce)
        )
      ),
      math.multiply(
        math.divide(
          math.multiply(n, math.i),
          math.multiply(
            math.subtract(ce, cs),
            m
          )
        ),
        prSolve(m, cs, ce, math.subtract(n, 1))
      )
    )
  } else {
    return 0
  }
}

/**
 * 主要计算函数2-贝塞尔曲线方程代入
 */
export function numSolve(m, cs, ce, pts) {
  pts = pts.map((p) => math.complex(p.re, p.im))
  return math.add(
    math.multiply(
      math.add(
        math.subtract(
          math.subtract(
            math.multiply(3, pts[1]),
            pts[0]
          ),
          math.multiply(3, pts[2])
        ),
        pts[3]
      ),
      prSolve(m, cs, ce, 3)
    ),
    math.multiply(
      3,
      math.add(
        math.subtract(
          pts[0],
          math.multiply(2, pts[1])
        ),
        pts[2]
      ),
      prSolve(m, cs, ce, 2)
    ),
    math.multiply(
      3,
      math.subtract(
        pts[1],
        pts[0]
      ),
      prSolve(m, cs, ce, 1)
    ),
    math.multiply(pts[0], prSolve(m, cs, ce, 0))
  )
}

export function cpToList(cp) {
  return [cp.re, cp.im]
}
