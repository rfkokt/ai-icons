// CommonJS wrapper to isolate potrace from Next.js bundling
const potrace = require('potrace')

module.exports = {
  trace: (buffer, options, callback) => {
    const tracer = new potrace.Potrace(options)
    tracer.loadImage(buffer, (err) => {
      if (err) {
        return callback(err)
      }
      try {
        const svg = tracer.getSVG()
        callback(null, svg)
      } catch (e) {
        callback(e)
      }
    })
  }
}
