const { response } = require( 'express' );
const bcryptjs = require('bcryptjs');

const usuario = require('../models/usuario');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res) => {

    const { email, password} = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email});

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'email no encontrado'
            });
        }

        // Verificar contraseña
        const validPassword = bcryptjs.compareSync( password, usuarioDB.password);

        if ( !validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        // Generar el TOKEN - JWT
        const token = await  generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: falsem,
            msg: 'Error: Hable con el administrador'
        })
    }

}

module.exports = {
    login
}