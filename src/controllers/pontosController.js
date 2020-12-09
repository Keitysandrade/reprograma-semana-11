const pontos = require("../models/ponto.json")
const fs = require("fs")


const getAllPontos = (req, res) => {
    console.log("Minha query string:")
    console.log(req.query)
    const tipoDeResiduo = req.query.tipoDeResiduo // puxamos a informação de tipoDeResiduo da nossa query string
    if (tipoDeResiduo) { // se eu tiver passado a query string com o tipoDeResiduo na hora de fazer a request...
        //filtra por tipoDeResiduo meus pontos
        
        const pontosBytipoDeResiduo = pontos.filter(ponto => ponto.tipoDeResiduo.includes(tipoDeResiduo)) 
        res.status(200).send(pontosBytipoDeResiduo) // retorno apenas os filmes com o gênero que filtrei por query string
    } else { // se eu NAO tiver passado genero na minha query string...
        res.status(200).send(pontos) // retorna todos os filmes sem filtro
    }
}

const createPonto = (req, res) => {
    console.log (req.body)
    const { id, tipoDeResiduo , bairro, endereço } = req.body
    
    pontos.push({ id, tipoDeResiduo, bairro, endereço })
    fs.writeFile("./src/models/ponto.json", JSON.stringify(pontos), 'utf8', function (err) { 
        if (err) {
            res.status(500).send({ message: err })
        } else {
            console.log("Ponto criado com sucesso!")
            const pontoFound = pontos.find(ponto => ponto.id == id)    
            res.status(200).send(pontoFound)
        }
    })
}

const updatePonto = (req, res) => {
    const pontoId = req.params.id
    const pontoToUpdate = req.body

    console.log(pontos)

    const pontoFound = pontos.find(ponto => ponto.id == pontoId) //separei o ponto que vou atualizar
    const pontoIndex = pontos.indexOf(pontoFound) // separei o indice do ponto no meu array de pontos

    if (pontoIndex >= 0) { // verifico se o ponto existe no array de pontos
        // ponto foi encontrado
        pontos.splice(pontoIndex, 1, pontoToUpdate) // busco no array o ponto, excluo o registro antigo e subtituo pelo novo
        fs.writeFile("./src/models/ponto.json", JSON.stringify(pontos), 'utf8', function (err) {
            if (err) {
                res.status(500).send({ message: err }) // caso de erro retorno status 500
            } else {
                console.log("Arquivo do ponto foi atualizado com sucesso!")
                const pontoUpdated = pontos.find(ponto => ponto.id == pontoId)
                res.status(200).send(pontoUpdated)
            }
        })
    } else {
        //ponto nao foi encontrado
        res.status(404).send({ message: "Ponto não encontrado para ser atualizado!" })
    }
}
const deletePonto = (req, res) => {
    try {
        const pontoId = req.params.id
        const pontoFound = pontos.find(ponto => ponto.id == pontoId) // encontro o ponto pelo id
        const pontoIndex = pontos.indexOf(pontoFound) // identifico o índice do ponto no meu array

        if (pontoIndex >= 0) { // verifico se o ponto existe no array de pontos
            pontos.splice(pontoIndex, 1) // removo o ponto pelo índice
        } else {
            res.status(404).send({ message: "Ponto não encontrado para ser deletado" })
        }

        fs.writeFile("./src/models/ponto.json", JSON.stringify(pontos), 'utf8', function (err) { // gravo meu array de pontos sem o ponto que deletei
            if (err) {
                res.status(500).send({ message: err })
            } else {
                console.log("Ponto deletado com sucesso!")
                res.sendStatus(204)
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Erro ao deletar o ponto" })
    }
}



module.exports = {
    getAllPontos,
    createPonto, 
    updatePonto,
    deletePonto

}