module.exports = {
    name: {
        type: 'string',
        isAbsolute: true,
        min: 3,
        required: true
    },

    email: {
        type: 'string',
        min: 10,
        required: true
    },

    password: {
        type: 'string',
        min: 6,
        required: true
    }
}