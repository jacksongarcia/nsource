'use strict'

const Header = require('./Components/Header')
const Config = require('./Config')

const config = new Config
const header = new Header

config.loadRepository()

header.initEventTop()
header.create()
