class AppointmentFactory {
    // Esta função retorna os dados date time do banco de dados em outro formato para serem exibidas no calendário.

    // Função muito importante para manipulação de datas e horas 
    Build(appointment){
        // Divisão da data
        var day = appointment.date.getDate()+1
        var month = appointment.date.getMonth()
        var year = appointment.date.getFullYear()
        // divisão do tempo
        var hour = Number.parseInt(appointment.time.split(':')[0])
        var minutes = Number.parseInt(appointment.time.split(':')[1])

        // Date é função para data, porem ela usa o horario universal por padrão, então irá aumentar a data em 3 horas, então em seguida devemos diminuir 3 horas. Neste projeto não precisa diminuir porque o fullcalendar já ajusta o horario pelo locale
        var newDate = new Date(year, month, day, hour, minutes, 0, 0)
        // newDate.setHours(newDate.getHours() - 3)

        var appo = {
            id: appointment._id,
            title: appointment.name + ' ' + appointment.description,
            start: newDate,
            end: newDate,
            email: appointment.email,
            notified: appointment.notified
        }
        return appo
    }


    ConferenceDate(appointment){
        // Date user
        var day = Number.parseInt(appointment.date.split('-')[2])
        var month = Number.parseInt(appointment.date.split('-')[1])
        var year = Number.parseInt(appointment.date.split('-')[0])
        console.log(day, month, year)
        // Date now
        var DateNow = new Date()
        var dateday = DateNow.getDate()
        var datedayComper = DateNow.getDate()+1
        var datemonth = DateNow.getMonth()+1
        var dateyear = DateNow.getFullYear()
        if(year < dateyear){
            return {status: false, err: `O ano ${year} já passou. Atualize o seu calendário para o ano de ${dateyear}`}
        }
        else{
            if(month < datemonth){
                return {status: false, err: `O mês selecionado já passou, verifique o seu calendário novamente.`}
            }
            else{
                if(day <= datedayComper){
                    return {status: false, err: 'O dia para agendamento não pode ser marcado em dias posteriores a data atual, e deve-se ser marcado com 48 horas de antecendência. Antes de 48 horas apenas com encaixes ou desistências. Por favor entrar em contato com o nosso atendimento.'}
                }
                else{
                    return {status: true}
                }
            }
        }
    }
}


module.exports = new AppointmentFactory();