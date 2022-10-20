const csvToJson = require("convert-csv-to-json")
const fs = require("fs")
const path = require("path")
const {parse} = require("json2csv")

let authors = csvToJson.getJsonFromCsv("./csv-data/authors.csv")
let books = csvToJson.getJsonFromCsv("./csv-data/books.csv")
let magazines = csvToJson.getJsonFromCsv("./csv-data/magazines.csv")

exports.getIndex = (req, res, next) => {
    res.render("index", {
        exported:false
    })
}

exports.getAllbms =  (req, res, next) => {  // get all books and magazines

    console.log(books, magazines)
    res.render('bookandmagazine', {
        books,
        magazines,
        sorted:false
    })

}

exports.getAllSortedbms = (req, res, next) => {    // sorted books and magazine by title
    
    let mergedbm = books.concat(magazines)
    let sortedbms = mergedbm.sort((x,y) =>
    (x.title < y.title) ? -1 : ((x.title > y.title) ? 1 : 0))
    console.log(sortedbms)
    
    res.render('bookandmagazine', {
        sortedbms,
        sorted:true,
        findbyId:false,
        findbyEmail:false,
    })

}

exports.findBookandMagazine =  (req, res, next) => {  // find a book or magazine by isbn or email
    
    const {isbn_email} = req.body
    let newbm = books.concat(magazines)
    console.log(isbn_email)
     if(isbn_email.match('@')){  // match email
        let resultbyEmail = 
        newbm.filter(key => key.authors.split(',')
        .find(email => email === isbn_email))
        console.log(resultbyEmail)
        return res.render('bookandmagazine', {
            sortedbms:resultbyEmail,
            sorted:true,
            findbyId:false,
            findbyEmail:true,
            isbn_email
        })
       
    } else if(isbn_email.match('[0-9]\-')){ // match ISBN
        let resultbyId = newbm.find(key => key.isbn === isbn_email)
        return res.render('bookandmagazine', {
            sortedbms:[resultbyId],
            sorted:true,
            findbyEmail:false,
            findbyId:true,
            isbn_email
        })
    } else {
        console.log("Not Found")
    }
    // 5554-5545-4518
}

exports.exportRandom_bm =  (req, res, next) => {        // export a random book and a magazine to csv file
    let randomBook = books[Math.round(Math.random()*7)]
    let randomMagazine = magazines[Math.round(Math.random()*5)]
    let mergedbm = [{...randomBook, ...randomMagazine}]
    console.log(mergedbm)
    
    const filePath = path.join("csv-data", "Random_book_and_magazine.csv")
    let csv
    try{
        csv = parse(mergedbm)
    } catch(err){
       console.log(err)
    }
    fs.writeFile(filePath, csv, (err) => {
        if(err){
            console.log(err)
        } else {
            setTimeout(function () {
                fs.unlinkSync(filePath); // delete this file after 1 minute
            }, 60*1000)
            
        return res.render("index", {
            exported:true
        })
            
        }
    })
}

// Jest Unit Testing
exports.booksType = () => {
    return typeof books
}

exports.magazinesType = () => {
    return typeof magazines
}