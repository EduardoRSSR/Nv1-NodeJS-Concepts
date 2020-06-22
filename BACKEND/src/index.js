const express = require ('express');
const {uuid, isUuid} = require('uuidv4');
const app = express();

app.use(express.json()) //.use para adicionar alguma função que todas as rotas vão ter que passar.

const projects = [];

function logRequests( request, response, next){ // Esse middleware vai registrar todas rotas e métodos chamados na aplicação
    const {method, url} = request;                                 //recebe o metodo e url do request

    const logLabel = `[${method.toUpperCase()} ${url}]` ;          // vetor com o método e url recebida

    console.log(logLabel);                                          // mostra o label

    return next();                                                  // chama o próximo método, sem interromper o fluxo do app
}


function validateProjectId(request, response, next){ // middleware para validar o Id.

    const { id } = request.params;

    if(!isUuid(id)){
        return response.status(400).json({error: 'Invalid project ID.'});
    }

    return next()
}
app.use(logRequests);                                     // chama o middleware
app.use('/projects/:id', validateProjectId);             // vai chamar o middleware apenas nas rotas que contém esse formato

app.get('/projects', (request, response) =>{

    const {title} = request.query 

    const results = title  // verifica se o titulo foi preenchido pelo usuário
    ? projects.filter(project => project.title.includes(title)) // se tiver filtro, vai ser verificado se no título incluido
    : projects;


    return response.json(results);
});

app.post('/projects', (request, response) =>{
    const {title, owner} = request.body;

    const project = {id: uuid(), title, owner};

    projects.push(project);

    return response.json(project);
    
});

app.put('/projects/:id', (request, response) =>{
    
    const { id } = request.params; // Vai receber o id
	const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);
    
    if(projectIndex < 0){ 
    return response.status(400).json({error: 'Project not found'})
    }
    
    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) =>{
    
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);
    
    if(projectIndex < 0){ 
    return response.status(400).json({error: 'Project not found'})
    }
    
    projects.splice(projectIndex, 1);

	return response.status(204).send();
    
});

app.listen(3333, () => {
    console.log ('Back-end Started!')
})

