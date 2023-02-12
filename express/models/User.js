const {Schema, model} = require('mongoose')


const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}]
})
// console.log(111111, module)
module.exports = model('User', User)
