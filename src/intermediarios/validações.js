const { banco } = require('../banco/bancoDeDados');

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: 'É necessário informar a senha do banco' })
    }
    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' })
    }
    next();
}

module.exports = {
    validarSenha
}