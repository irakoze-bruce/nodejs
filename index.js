const http = require("http")
const url = require("url")
const fs = require("fs")

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productname)
  output = output.replace(/{%PRICE%}/g, product.price)
  output = output.replace(/{%QUANTITY%}/g, product.quantity)
  output = output.replace(/{%DESCRIPTION%}/g, product.description)
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%ID%}/g, product.id)
  output = output.replace(/{%FROM%}/g, product.from)
  output = output.replace(/{%IMAGE%}/g, product.image)

  if (product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
  }

  return output
}

const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template_card.html`, "utf-8")
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template_product.html`, "utf-8")
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template_overview.html`, "utf-8")

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, "utf-8")
const dataObject = JSON.parse(data)

const app = http.createServer((req, res) => {

  const { pathname, query } = url.parse(req.url, true)

  if (pathname === '/' || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" })

    const cardHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join("")
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml)

    res.end(output)

  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" })
    const product = dataObject[query.id]
    const output = replaceTemplate(tempProduct, product)
    res.end(output)
  }
  else {
    res.writeHead(404, { "content-type": "text/html" })
    res.end("<h1>Page not found</h1>")
  }

})

app.listen(8000)
