'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  WEBSOCKET_API: '"ws://192.168.18.240:19003"',
  REALTTIME_API: '"http://192.168.18.188:8666/#/"',
  FLOOD_API:'"http://192.168.18.188:8666/#/jn-iframe"',
  RIVERMONITOR_API:'"http://192.168.18.188:8666/#/drainageRiver"',
})
