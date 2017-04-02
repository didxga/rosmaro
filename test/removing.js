const build_storage = require('./storage_test_double')
const build_rosmaro = require('./../src/rosmaro')
const lock_mock = require('./lock_test_double')
const assert = require('assert')

describe("removing the model", function () {
  it("removes all the data and calls on leave actions of the recent node", async function () {

    let log = []

    const storage = build_storage()

    const model = build_rosmaro({
      type: "machine",
      entry_point: "A",
      states: [

        ["A", {
          type: "prototype",
          fill_in() {
            this.transition("x", {some: "data"})
          }
        }, {x: "B"}],

        ["B", {
          type: "prototype",
          before_leave() {
            log.push("B before")
          },
          after_leave() {
            log.push("B after")
          }
        }]

      ]
    }, storage, lock_mock().lock)

    await model.fill_in()
    assert(!storage.is_empty())
    await model.remove()
    assert(storage.is_empty())
    assert.deepEqual(["B before", "B after"], log)

  })
})