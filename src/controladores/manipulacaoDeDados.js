let { contas, depositos, transferencias, saques } = require('../banco/bancoDeDados');
let numero_conta = 3;
const moment = require('moment');


const adicionarConta = (req, res) => {
    const { nome, cpf, email, senha, data_nascimento, telefone } = req.body;

    if (!nome || !cpf || !email || !senha || !data_nascimento || !telefone) {
        return res.status(400).json({ mensagem: 'Todos os campos são necessários' })
    }

    const contaAlvoCpf = contas.find((conta) => {
        return conta.usuario.cpf === +cpf
    });

    const contaAlvoEmail = contas.find((conta) => {
        return conta.usuario.email === email
    });

    if (contaAlvoCpf || contaAlvoEmail) {
        return res.status(400).json({ mensagem: 'Ja existe uma conta registrada com esse CPF ou email' })
    }

    const novaConta = ({
        numero: numero_conta,
        saldo: 0,
        usuario: {
            nome, 
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    });

    contas.push(novaConta);

    numero_conta ++;

    return res.status(201).json();
}

const atualizarDados = (req, res) => {
    const { numero_conta } = req.params;
    const { nome, cpf, email, senha, data_nascimento, telefone } = req.body;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'É necessário informar o numero da conta' })
    }

    const contaAlvo = contas.find((conta) => {
        return conta.numero === +numero_conta
    });

    if (!contaAlvo) {
        return res.status(404).json({ mensagem: 'Conta inexistente' })
    }

    if (nome) {
        contaAlvo.usuario.nome = nome;
    }
    if (cpf) {
        contaAlvo.usuario.cpf = cpf;
    }
    if (data_nascimento) {
        contaAlvo.usuario.data_nascimento = data_nascimento;
    }
    if (telefone) {
        contaAlvo.usuario.telefone = telefone;
    }
    if (email) {
        contaAlvo.usuario.email = email;
    }
    if (senha) {
        contaAlvo.usuario.senha = senha;
    }

    return res.status(201).json();
}

const excluirConta = (req, res) => {
    const{ numero_conta } = req.params;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'É necessário informar o numero da conta' })
    }

    const contaAlvo = contas.find((conta) => {
        return conta.numero === +numero_conta
    });

    if (!contaAlvo) {
        return res.status(404).json({ mensagem: 'Conta inexistente' })
    }
    if (contaAlvo.saldo !== 0) {
        return res.status(401).json({ mensagem: 'Não é possível excluir a conta, devido a presença de fundos' })
    }
    //*//
    contas = contas.filter((conta) => {
        return conta.numero !== +numero_conta;
    });

    console.log(contas === contas);


    return res.json();
}

const deposito = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: 'É necessário informar o numero da conta e o valor a ser depositado' })
    }
    if (valor < 0) {
        return res.status(400).json({ mensagem: 'O valor informado é incompatível' })
    }

    const contaAlvo = contas.find((conta) => {
        return conta.numero === +numero_conta
    });

    if (!contaAlvo) {
        return res.status(404).json({ mensagem: 'Conta inexistente' })
    }

    const data_deposito = moment().format('YYYY-MM-DD HH:mm:ss');

    depositos.push({
        data: data_deposito,
        numero_conta,
        valor
    });

    contaAlvo.saldo += valor;

    return res.json();

}

const saque = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: 'É necessário informar o numero da conta e o valor a ser depositado' })
    }
    if (valor < 0) {
        return res.status(400).json({ mensagem: 'O valor informado é incompatível' })
    }

    const contaAlvo = contas.find((conta) => {
        return conta.numero === +numero_conta
    });

    if (!contaAlvo) {
        return res.status(404).json({ mensagem: 'Conta inexistente' })
    }
    if (contaAlvo.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente' })
    }

    const data_saque = moment().format('YYYY-MM-DD HH:mm:ss');

    saques.push({
        data: data_saque,
        numero_conta,
        valor
    });

    contaAlvo.saldo -= valor;

    return res.json();
}

const transferencia = (req, res) => {
    const { senha } = req.params;
    const { conta_origem, conta_destino, valor } = req.body;
    

    if (!conta_origem || !conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: 'É necessário informar a conta origem, destino e o valor' })
    }
    if (valor < 0) {
        return res.status(400).json({ mensagem: 'O valor informado é incompatível' })
    }
    if (conta_origem === conta_destino) {
        return res.status(400).json({ mensagem: 'Não é possovel fazer uma transferencia para a mesma conta' })
    }

    const contaOrigem = contas.find((conta) => {
        return conta.numero === +conta_origem
    });

    const contaDestino = contas.find((conta) => {
        return conta.numero === +conta_destino
    });

    if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: 'Não encontramos uma das contas em nosso sistema' })
    }

    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente' })
    }

    if (contaOrigem.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' })
    }

    const data_tranferencia = moment().format('YYYY-MM-DD HH:mm:ss');

    transferencias.push({
        data: data_tranferencia,
        conta_origem,
        conta_destino,
        valor
    });

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    return res.json();
}

module.exports = {
    adicionarConta,
    atualizarDados,
    excluirConta,
    deposito,
    saque,
    transferencia
}