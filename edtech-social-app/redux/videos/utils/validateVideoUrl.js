import validator from 'validator'

export const isValidVideoUrl = (url) => {
    var validator = require('validator');
    return validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })
  }