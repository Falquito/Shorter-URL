import express from 'express'
import { ValidarUrl } from './UrlScheme.js'
import fs from 'fs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const randomStrings = require('random-strings')
const app=express()
//middleware para parsear el body antes de llegar a las request
app.use(express.json())
//lista de urls
fs.writeFile('urls.json',JSON.stringify([],null,2),(err)=>{
    if(err){
        console.log(err)
        return
    }
})
app.get("/shorten/:shorturl",(req,res)=>{
    const {shorturl} = req.params
    if(ValidarUrl(shorturl).success){
        fs.readFile('urls.json',(err,data)=>{
            const list_urls = JSON.parse(data)
            for(let i=0;i<list_urls.length;i++){
                if(list_urls[i].shortCode==shorturl){
                    res.status(200).json({YourUrl:list_urls[i].url})
                    break
                }
            }
        })
    }else{
        res.status(404).send("not found url")
    }
})
app.get('/shorten/:shortUrl/stats',(req,res)=>{
    const {shortUrl} = req.params;
    if(ValidarUrl(shortUrl).success){
        fs.readFile('urls.json',(err,data)=>{
            if(err){
                console.log(err)
                return
            }
            for(let i=0;i<JSON.parse(data).length;i++){
                if(JSON.parse(data)[i].shortCode==shortUrl){
                    res.status(200).json(JSON.parse(data));
                    return;
                }
            }
            res.status(404).send("no se encontro la url bro :(")
        })
    }
})
app.post("/shorten",(req,res)=>{
    const {url} = req.body;
    if(ValidarUrl(url).success){
        console.log("es una url")
        fs.readFile('urls.json',(err,data)=>{
            if(err){
                console.log("error al leer el archivo",err)
            }
            const list_urls = JSON.parse(data)
            list_urls.push({
                id:crypto.randomUUID(),
                url:url,
                shortCode:randomStrings.random(6,'abcdefghijklmnopqrstuvwxyz0123456789'),
                createdAt:new Date(),
                updatedAt:'recently-created'
            })
            fs.writeFile('urls.json',JSON.stringify(list_urls,null,2),(err)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log(`tu url corta es ${list_urls[list_urls.length-1].shortCode}`)
                    return res.status(201).send(`tu url corta es ${list_urls[list_urls.length-1].shortCode}`)
                }
            })
        })
    }else{res.status(400).send("todo mal")}
})

app.put("/shorten/:shorturl",(req,res)=>{
    const {shorturl} = req.params;
    const {newUrl} = req.body;
    if(ValidarUrl(shorturl).success){
        fs.readFile('urls.json',(err,data)=>{
            if(err){
                console.log(err)
                return
            }
            const list_urls = JSON.parse(data)
            for(let i=0;i<list_urls.length;i++){
                if(list_urls[i].shortCode==shorturl){
                    list_urls[i].url=newUrl
                    fs.writeFile('urls.json',JSON.stringify(list_urls,null,2),(err)=>{
                        if(err){
                            console.log(err)
                            return
                        }   
                        res.status(200).send(`the url updated now is: ${list_urls[i].url}`)
                    })
                    break
                }
            }

            
        })
    }else{
        res.status(400).send("todo mal chat")
    }
})


app.listen(3000,()=>{
    console.log(`listen on http://localhost:${3000}`)
})