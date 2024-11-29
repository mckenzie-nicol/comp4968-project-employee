// headers.js
// Different header templates to apply to lambda response

const genericHeaders = {
    'Content-Type': 'application/json',    
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': "DELETE, OPTIONS",
}

const protectedHeaders = {
    'Content-Type': 'application/json',    
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': "DELETE, OPTIONS",
    'Access-Control-Allow-Credentials': true
}

module.exports = {
    genericHeaders: genericHeaders,
    protectedHeaders, protectedHeaders
}