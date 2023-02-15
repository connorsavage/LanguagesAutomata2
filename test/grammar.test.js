import assert from "assert/strict"
import fs from "fs"
import ohm from "ohm-js"

const syntaxChecks = [
  ["all numeric literal forms", "print(8 * 89.123)"],
  ["complex expressions", "print(83 * ((((-((((13 / 21)))))))) + 1 - 0)"],
  ["all unary operators", "print (-3) print (!false)"],
  ["all binary operators", "print x && y || z * 1 / 2 ** 3 + 4 < 5"],
  ["all arithmetic operators", "varus x = (!3) * 2 + 4 - (-7.3) * 8 ** 13 / 1"],
  ["all relational operators", "varus x = 1<(2<=(3==(4!=(5 >= (6>7)))))"],
  ["all logical operators", "varus x = true && false || (!false)"],
  ["the conditional operator", "print x ? y : z"],
  ["end of program inside comment", "print(0) cR yay"],
  ["comments with no text are ok", "print(1)cR\nprint(0)cR"],
  ["non-Latin letters in identifiers", "コンパイラ = 100"],
]

const syntaxErrors = [
  ["non-letter in an identifier", "ab😭c = 2", /Line 1, col 3/],
  ["malformed number", "x= 2.", /Line 1, col 6/],
  ["a missing right operand", "print(5 -", /Line 1, col 10/],
  ["a non-operator", "print(7 * ((2 _ 3)", /Line 1, col 15/],
  ["an expression starting with a )", "x = )", /Line 1, col 5/],
  ["a statement starting with expression", "x * 5", /Line 1, col 3/],
  ["an illegal statement on line 2", "print(5)\nx * 5", /Line 2, col 3/],
  ["a statement starting with a )", "print(5)\n) * 5", /Line 2, col 1/],
  ["an expression starting with a *", "x = * 71", /Line 1, col 5/],
]

describe("The grammar", () => {
  const grammar = ohm.grammar(fs.readFileSync("src/sussyScript.ohm"))
  for (const [scenario, source] of syntaxChecks) {
    it(`properly specifies ${scenario}`, () => {
      assert(grammar.match(source).succeeded())
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`does not permit ${scenario}`, () => {
      const match = grammar.match(source)
      assert(!match.succeeded())
      assert(new RegExp(errorMessagePattern).test(match.message))
    })
  }
})
