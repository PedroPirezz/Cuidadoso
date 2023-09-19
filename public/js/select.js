const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
const uf = document.getElementById("uf")
const city = document.getElementById("city")

uf.addEventListener('change', async function() {
    const urlCidade = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+uf.value+'/distritos?orderBy=nome'
    const request = await fetch(urlCidade)
    const response = await request.json()
    let options = ''
    response.forEach(element => {
        options += '<option>'+element.nome+'</option>'
    })
    city.innerHTML = options
})

window.addEventListener('load', async () => {
    const request = await fetch(url)
    const response = await request.json()

    const options = document.createElement("optgroup")
    options.setAttribute('label', 'UFs')
    response.forEach(element => {
        options.innerHTML += '<option>' +element.sigla+'</option>'
    });
    uf.append(options)
})



const uf1 = document.getElementById("uf1")
const city1 = document.getElementById("city1")


uf1.addEventListener('change', async function() {
    const urlCidade = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+uf1.value+'/distritos?orderBy=nome'
    const request = await fetch(urlCidade)
    const response = await request.json()
    let options = ''
    response.forEach(element => {
        options += '<option>'+element.nome+'</option>'
    })
    city1.innerHTML = options
})

window.addEventListener('load', async () => {
    const request = await fetch(url)
    const response = await request.json()

    const options = document.createElement("optgroup")
    options.setAttribute('label', 'UFs')
    response.forEach(element => {
        options.innerHTML += '<option>' +element.sigla+'</option>'
    });
    uf1.append(options)
})