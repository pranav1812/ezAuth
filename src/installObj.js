module.exports= {
    backend:{
        standard: ['express', 'mongoose', 'dotenv', 'passport', 'cookie-session', 'cors'],
        facebook: ['passport-facebook'],
        github: ['passport-github'],
        google: ['passport-google-oauth2'],
        email: ['bcryptjs', 'passport-local', 'nodemailer'],
        dev: ['nodemon']
    },
    firebase: ['firebase'],
    react: {
        standardCsr: ['react', 'react-dom', 'react-scripts'],
        routing: ['react-router-dom'],
        redux: ['redux', 'react-redux']
    }
}