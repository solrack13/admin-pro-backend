
const mongoose = require('mongoose');

console.log('=> '+process.env.DB_CNN);


const dbConnection = async () => {

    try{
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB Online');
    } catch(error){
        consog.log(error);
        throw new Error('Error a la hora de inciiar la BD ver Logs');

    }

}

module.exports = {
    dbConnection
}