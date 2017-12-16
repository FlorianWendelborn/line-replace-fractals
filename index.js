const fs = require('fs')

// patterns
const patterns = {
	dragon: [[0.5, 0.5], [0.5, -0.5, true]],
	dragon2: [[0.5, 0.5], [0.5, -0.5]],
	koch: [
		[1 / 3, 0, false],
		[1 / 6, -0.25, false],
		[1 / 6, 0.25, false],
		[1 / 3, 0, false],
	],
	buggedKoch: [
		[1 / 3, 0, false],
		[1 / 6, 1 / 3, true],
		[1 / 6, -1 / 3, true],
		[1 / 3, 0, false],
	],
}

// config
const ITERATIONS = 17
const LOG = false
const PATTERN = patterns.dragon
const SCALE = 1024

// helper
const applyMatrix = (m, v) => [
	m[0] * v[0] + m[2] * v[1],
	m[1] * v[0] + m[3] * v[1],
	v[2],
]

const applyLine = line => {
	const rotationMatrix = line[2]
		? [line[0], line[1], line[1], -line[0]]
		: [line[0], line[1], -line[1], line[0]]
	return PATTERN.map(item => applyMatrix(rotationMatrix, item))
}

console.time('generate fractal')
let path = [[SCALE, 0, false]]

for (let i = 0; i < ITERATIONS; i++) {
	LOG && console.log(path)
	const result = []
	path.forEach(line => {
		result.push(...applyLine(line))
	})
	path = result
}
LOG && console.log(path)
console.timeEnd('generate fractal')

console.time('calculate dimensions')
let maxX = Number.MIN_SAFE_INTEGER
let maxY = Number.MIN_SAFE_INTEGER
let minX = Number.MAX_SAFE_INTEGER
let minY = Number.MAX_SAFE_INTEGER
let currentX = 0
let currentY = 0
path.forEach(entry => {
	currentX += entry[0]
	currentY += entry[1]
	maxX = Math.max(currentX, maxX)
	maxY = Math.max(currentY, maxY)
	minX = Math.min(currentX, minX)
	minY = Math.min(currentY, minY)
})
const height = maxY - minY + 10
const width = maxX - minX + 10
const x = width - maxX - 5
const y = height - maxY - 5
LOG && console.log({ minX, maxX, maxY, minY, height, width })
console.timeEnd('calculate dimensions')

console.time('generate SVG')
fs.writeFileSync(
	`${__dirname}/output.svg`,
	`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><path d="M ${x} ${y} ${path.reduce(
		(previous, next) => `${previous}l ${next[0]} ${next[1]} `,
		''
	)}" stroke="#000" stroke-width="0.1" fill="none"/></svg>`
)
console.timeEnd('generate SVG')
