const mongoose = require('mongoose');

const connectdb = async () => {
    try{
        const conn =await mongoose.connect(process.env.db_url)
        console.log(`connected to database ${conn.connection.host}`.cyan.underline)
    }catch(error){
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectdb;