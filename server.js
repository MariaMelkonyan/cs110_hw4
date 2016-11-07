'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring'); 

 const todos = [
{
    id : Math.random()+'',
    message: 'Meet with Alice',
    completed: false
},
{
    id : Math.random()+'',
    message: 'Buy a birthday present',
    completed: false
},
{
    id : Math.random()+'',
    message: 'Call Phill',
    completed: false
}
];

const httpServer = http.createServer(function(req, res) {
    const FileLocation = './public';
    const myPath = path.join(FileLocation, req.url);

    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;
    fs.readFile(myPath, function(err, data) {
        
        res.statusCode = 200;
        res.end(data);   
    });

    if (req.url === '/todos') {
        if (method === 'GET') {
            res.end(JSON.stringify(todos));
        } 

    }
        if(method === 'POST') {
        	if(req.url.indexOf('/todos') === 0) {
                let body = '';
                req.on('data', function (chunk) {
                    body += chunk;
                });
                req.on('end', function () {
                    let jsonObj = JSON.parse(body);  
                    jsonObj.id = Math.random() + ''; 
                    todos[todos.length] = jsonObj;   

                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify(jsonObj));
                });
            }
        }
        
        if(method === 'DELETE') {
            if(req.url.indexOf('/todos/') >= 0) {
              
            let id =  req.url.substr(7);
            for(let i = 0; i < todos.length; i+=1) {
                if(id === todos[i].id) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end(JSON.stringify(todos));
                }
            }
            res.statusCode = 404;
            
            return res.end('Data was not found');
            }
        }
        
        if (method ==='PUT') {
            let body = '';
            req.on('data', function(chunk) {
                body += chunk;
            });
            req.on('end', function() {
                let jsonObj = JSON.parse(body);
                for(let i=0; i<todos.length; i+=1) {
                    if (jsonObj.id===todos[i].id) {
                        todos[i].completed=jsonObj.completed;
                    }  
                }
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(jsonObj.completed));

            });   
        }

});

httpServer.listen(2016);
