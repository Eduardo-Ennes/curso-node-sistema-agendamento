var Appointment = require('../models/Appointment')
var mongoose = require('mongoose')
const appo = mongoose.model('appointment', Appointment)
const AppoFac = require('../factories/AppointmentFactory')


class AppointmentService {

    async create(name, email, description, date, time){
        var newAppo = new appo({
            name: name,
            email: email,
            description: description,
            date: date,
            time: time,
            finished: false,
            notified: false
        })
        try{
            await newAppo.save()
            return {status: true, certo: 'Agendamento realizado com sucesso.'}
        }
        catch(err){
            console.log(err)
            return {status: false, err: 'Houve um erro ao agendar a consulta.'}
        }
    }


    async getAll(showFinished){
        if(showFinished){
            // Todas os usuarios 
            try{
                var result = await appo.find()
                if(result.length > 0){
                    var appointments = []
                    result.forEach(user => {
                        appointments.push(AppoFac.Build(user))
                    })
                    return {status: true, result: appointments}
                }else{
                    return {status: false, err: 'Não há usuarios cadastrados'}
                }
            }
            catch(err){
                return {status: false, err: 'Houve um erro na busca.'}
            }
        }
        else{
            // Usuarios que não foram atendidos
            try{
                var result = await appo.find({'finished': false})
                if(result.length > 0){
                    var appointments = []
                    result.forEach(user => {
                        appointments.push(AppoFac.Build(user))
                    })
                    return {status: true, result: appointments}
                }else{
                    return {status: false, err: 'Não há pacientes agendados'}
                }
            }
            catch(err){
                return {status: false, err: 'Houve um erro na busca.'}
            }
        }
    }


    async getFindById(id){
        try{
            var user = await appo.find({'_id': id})
            if(user.length > 0){
                return {status: true, user: user[0]}
            }
            else{
                return {status: false, err: 'Nenhum usuário encontrado.'}
            }
        }
        catch(err){
            console.log(err)
            return {status: false, err: 'Houve um error na busca do usuário'}
        }
    }


    async UpdateFinished(id){
        try{
            var user = await appo.findByIdAndUpdate(id, {finished: true})
            return {status: true, certo: 'Consulta finalizada com sucesso.'}
        }
        catch(err){
            return {status: false, err: 'Usuário não encontrado no banco de dados.'}
        }
    }


    async getAllOf(){
        try{
            var users = await appo.find()
            return {status: true, certo: users}
        }
        catch(err){
            return {status: false, err: 'Não há usuarios cadastrados no momento.'}
        }
    }


    // Um metodo de search usando o bando de dados
    async Search(query){
        try{
            var user = await appo.find().or([{email: query}, {name: query}])
            return {status: true, certo: user}
        }
        catch(err){
            return {status: false, err: 'Não foi possivel encontrar um usuário, tente novamente.'}
        }
    }


    async getAllOfNotifiedFalse(){
        try{
            var notifiedUsers = await appo.find({'notified': false})
            return {status: true, result: notifiedUsers}
        }catch(err){
            return {status: false, err: 'Houve um erro ao buscar os usuarios.'}
        }
    }


    async notification(){
        try{
            var appos = await this.getAllOfNotifiedFalse()
            console.log('APPOS: ' + appos.result)
            if(appos.status){
                var transport = nodemailer.createTransport({
                    host: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                      user: "0dc9d6ba93eeb5",
                      pass: "5200bcd7119fd6"
                    }
                  });
                  
                appos.result.forEach(app => {
                var date = app.start.getTime()
        
                // date é a data que esta no banco de dados
                var hour48 = 1000 * 60 * 60 * 48
                // mandar notificação para 48 horas antes
                var calc = date - Date.now()
                if(calc <= hour48){
                    if(app.notified == false){
                        console.log('ENTROU NA CONDIÇÃO')

                        transport.sendMail({
                        from: "Teste Teste <teste@teste.com>",
                        to: app.email,
                        subject: "Testando o vio de e-mail",
                        text: "Testando o meu primiro envio de e-mail"
                        }).then(res => {
                            return {status: true, certo: 'E-mail enviado com sucesso.'}
                        }).catch(error => {
                            console.log(error)
                            return {status: false, err: 'Houve um erro ao enviar o e-mail'}
                        })
                    }
                }
            })
            }else{
                return {status: false, err: 'Não há usuarios com consultas marcadas.'}
            }
        }catch(err){
            return {status: false, err: 'Houve um erro no servidor.'}
        }
    }
}


module.exports = new AppointmentService();