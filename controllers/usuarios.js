const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json( {
        ok: true,
        usuarios,
    })
}

const crearUsuario = async(req, res = response) => {

    const { email, password} = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body);
        
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt);

        console.log('usuario *** =>');
        console.log(usuario.id);

        // Generar el TOKEN - JWT
        const token = await  generarJWT( usuario.id );

        
        // Guardar usuario
        await usuario.save();
    
        res.json({
            ok: true,
            usuario,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
        
    }
}

const actualizarUsuario = async ( req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto
    console.log('Se procede a actualizar el usuario!');

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }


        // Actualizaciones
        const { password, google, email, ...campos} = req.body;


        if( usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email 2'
                })
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true} );

        console.log('usuario actualizado =>');
        console.log(req.body);

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarUsuario = async( req, res = response) => {

    const uid = req.params.id;
    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }


        await Usuario.findByIdAndDelete( uid);
    
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}