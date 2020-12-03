const jwt = require("jsonwebtoken");



const validarJWT = (req, res, next) => {
    console.log('*** entra en validar-jwt');

    // Leer el Token
    const token = req.header('x-token');

    console.log(token);
    if( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.JWT_SECRET);
        req.uid = uid;
        next();
        
    } catch (error) {

        console.log(error);

        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
    //next();

}

module.exports = {
    validarJWT
}