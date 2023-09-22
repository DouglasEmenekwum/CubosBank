const express = require('express');
const { validarSenha } = require('../intermediarios/validações');
const { listarContas, saldo, extrato } = require('../controladores/obtencaoDeDados');
const { adicionarConta, atualizarDados, excluirConta, deposito, saque, transferencia } = require('../controladores/manipulacaoDeDados');
const rotas = express();

rotas.use(validarSenha);

rotas.get('/contas', listarContas);
rotas.post('/conta', adicionarConta);
rotas.put('/conta/:numero_conta', atualizarDados);
rotas.delete('/conta/:numero_conta', excluirConta);
rotas.post('/deposito/:numero_conta', deposito);
rotas.post('/saque/:numero_conta', saque);
rotas.post('/transferencia/:senha', transferencia);
rotas.get('/saldo/:numero_conta', saldo);
rotas.get('/extrato/:numero_conta/:senha', extrato);



module.exports = rotas;