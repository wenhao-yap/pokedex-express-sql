const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const { Client } = require('pg');

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set handlebars to be the default view engine
app.engine('handlebars', exphbs.create().engine);
app.set('view engine', 'handlebars');


/**
 * ===================================
 * Routes
 * ===================================
 */
app.get('/new', (request, response) => {
  // respond with HTML page with form to create new pokemon
  response.render('new');
});

app.get('/:id/edit', (request, response) => {
  const client = new Client({
    user: 'wenhao',
    host: 'localhost',
    database: 'pokemons',
    port: 5432,
  });

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);
    let queryString = "SELECT * FROM pokemon WHERE id=" + request.params.id + ";";

    client.query(queryString,(err,cRes) => {
      if(err) {
        console.error('query error:', err.stack);
      }
      else{
        let output = cRes.rows[0];
        let context = {
          pokemon : output
        }
        response.render('edit',context);
        client.end();
        }
    })
  })

});

app.get('/:id', (request,response) => {
  const client = new Client({
    user: 'wenhao',
    host: 'localhost',
    database: 'pokemons',
    port: 5432,
  });

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);
    let queryString = "SELECT * FROM pokemon WHERE id=" + request.params.id + ";";
    console.log(queryString);

    client.query(queryString,(err,cRes) => {
      if(err) {
        console.error('query error:', err.stack);
      }
      else{
        let output = cRes.rows[0];
        let context = {
          pokemon : output
        }
        response.render('pokemon',context);
        client.end();
        }
    })
  })

});

app.get('/', (request, response) => {
  const client = new Client({
    user: 'wenhao',
    host: 'localhost',
    database: 'pokemons',
    port: 5432,
  });
  // query database for all pokemon
  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    let queryString = "SELECT * FROM pokemon;";

    client.query(queryString,(err,cRes) => {
      if(err) {
        console.error('query error:', err.stack);
      }
      else{
        let allPoke = [];
        for (let i=0; i<cRes.rows.length; i++){
          allPoke.push(cRes.rows[i]);
          console.log(allPoke);
        }
        // respond with HTML page displaying all pokemon
        let context = {
          pokemon : allPoke
        }
        console.log("before render");
        response.render('home', context);
        console.log("after render");
        client.end();
        console.log("after client end");
      }
    });
  });

});

app.post('/pokemon', (req, response) => {
  const client = new Client({
    user: 'wenhao',
    host: 'localhost',
    database: 'pokemons',
    port: 5432,
  });

  let params = req.body;

  const queryString = 'INSERT INTO pokemon(name, height) VALUES($1, $2)'
  const values = [params.name, params.height];

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    client.query(queryString, values, (err, res) => {
      if (err) {
        console.error('query error:', err.stack);
      } else {
        console.log('query result:', res);

        // redirect to home page
        response.redirect('/');
      }
      client.end();
    });
  });
});

app.put('/:id',(request,response) => {
  const client = new Client({
    user: 'wenhao',
    host: 'localhost',
    database: 'pokemons',
    port: 5432,
  });

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    let inputId = request.params.id;
    let updatedPokemon = request.body;

    let queryString = "UPDATE pokemon SET num='" + updatedPokemon.num + "', name='" + updatedPokemon.name + "', img='" + updatedPokemon.img + "', weight='" + updatedPokemon.height + "',height='" + updatedPokemon.height + "' WHERE id=" + inputId + ";";

    console.log(queryString);

    client.query(queryString,(err,cRes) => {
      if(err) {
        console.error('query error:', err.stack);
      }
      else{
        console.log("updated submission");
        response.redirect(`/${request.params.id}`);
        client.end();
        }
    })
  })  
});

app.delete('/:id', (request, response) => {
  const client = new Client({
    user: 'wenhao',
    host: 'localhost',
    database: 'pokemons',
    port: 5432,
  });

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    let inputId = request.params.id;
    let updatedPokemon = request.body;

    let queryString = "DELETE FROM pokemon WHERE id=" + inputId + ";";

    console.log(queryString);

    client.query(queryString,(err,cRes) => {
      if(err) {
        console.error('query error:', err.stack);
      }
      else{
        console.log("deleted results");
        response.redirect('/');
        client.end();
        }
    })
  })  
});
/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
