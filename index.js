const http = require("http")
const url = require("url")
const fs = require("fs")
const replaceTemplate = require("./starter/modules/replaceTemplate")
const slugify = require("slugify")

const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template_card.html`, "utf-8")
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template_product.html`, "utf-8")
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template_overview.html`, "utf-8")

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, "utf-8")
const dataObject = JSON.parse(data)

const slug = dataObject.map(el => slugify(el.productName, { lower: true }))
console.log(slug)

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
