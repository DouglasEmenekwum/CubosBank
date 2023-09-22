let { contas, depositos, transferencias, saques } = require('../banco/bancoDeDados');
const { transferencia } = require('./manipulacaoDeDados');


const listarContas = (req, res) => {
    return res.json(contas);
}

const saldo = (req, res) => {
    const { numero_conta } = req.params;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'É ncessário informar o numero da conta' })
    }

    const contaAlvo = contas.find((conta) => {
        return conta.numero === +numero_conta
    });

    if (!contaAlvo) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }

    return res.json(contaAlvo.saldo)
}

const extrato = (req, res) => {
    const{ numero_conta, senha } = req.params;
    

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'É necessário informar o numero da conta e a senha da conta'})
    }
     const contaAlvo = contas.find((conta) => {
        return conta.numero === +numero_conta
    });

    if (!contaAlvo) {
        return res.status(404).json({ mensagem: 'Conta inexistente' })
    }
    if (contaAlvo.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha inválida' })
    }

    const depositos_conta = depositos.filter((deposito) => {
        return deposito.numero_conta === +numero_conta
    });

    const saques_conta = saques.filter((saque) => {
        return saque.numero_conta === +numero_conta
    });

    const transferencias_Enviadas = transferencias.filter((trans) => {
        return trans.conta_origem === +numero_conta
    });

    const transferencias_Recebidas = transferencias.filter((trans) => {
        return trans.conta_destino === +numero_conta
    });


    return res.json({
        depositos: depositos_conta,
        saques: saques_conta,
        transferencias_Enviadas,
        transferencias_Recebidas,
        saldo: contaAlvo.saldo
    });
    
}

module.exports = {
    listarContas,
    saldo,
    extrato
}