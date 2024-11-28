// headers.js
// Different header templates to apply to lambda response

const genericHeaders = {
    'Content-Type': 'application/json',    
    'Access-Control-Allow-Origin': '*',
    'Access-Control-AllowMethods': "DELETE",
}

const protectedHeaders = {
    'Content-Type': 'application/json',    
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-AllowMethods': "DELETE",
    'Access-Control-Allow-Credentials': true
}

module.exports = {
    genericHeaders: genericHeaders,
    protectedHeaders, protectedHeaders
}