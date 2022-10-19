import express from "express"
import csvToJson from "convert-csv-to-json";
import fs from "fs"
import path from "path"
import {parse} from "json2csv"

const router = express.Router()

let authors = csvToJson.getJsonFromCsv("./csv-data/authors.csv")
let books = csvToJson.getJsonFromCsv("./csv-data/books.csv")
let magazines = csvToJson.getJsonFromCsv("./csv-data/magazines.csv")

router.get("/", (req, res, next) => {
    res.render("index")
})
router.get('/book&magazine', (req, res, next) => {
    console.log(books, magazines)
    res.render('bookandmagazine', {
        books,
        magazines,
        sorted:false
    })
})
router.get('/sortedbm', (req, res, next) => {    // sorted books and magazine
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
})

router.post('/findbm', (req, res, next) => {
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
})

router.post('/exportcsv', (req, res, next) => {
    let randomBook = books[Math.round(Math.random()*7)]
    let randomMagazine = magazines[Math.round(Math.random()*5)]
    let mergedbm = [{randomBook, randomMagazine}]
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
                fs.unlinkSync(filePath); // delete this file after 45 seconds
            }, 5*1000)
            
        return res.redirect('/')
            
        }
    })
})

export default router
