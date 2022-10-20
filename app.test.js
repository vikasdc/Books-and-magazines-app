const request =  require("supertest")
const bm = require("./controllers/bm")

test('should output Books type Object', () => {
  const output = bm.booksType()
  expect(output).toBe("object")
})
test('should output Magazines type Object', () => {
  const output = bm.magazinesType()
  expect(output).toBe("object")
})


