# Lesson 1 Learning points
## GraphQL Structure
--------------------
Schema (*.gql) - Files containing interfaces describing your data structure, the available queries and their return data types. Is made up of following types:
1. **type [Model]** - describes the fields and field type of our model object
   ```javascript
    type Cat{
      name: String
      breed: String
      age: Int!
    }
   ```
   
2. **type Query** - contains the list of functions available to a Graphql client, and the output each function returns.
   ```javascript
   type Query {
       myCat: Cat
   }
   // myCat function returns a Cat type object
   ```
   used together with resolvers to expose the functions to the graphql client as an API when creating the apollo server object later:
   ```javascript
   resolvers: {
      Query: {
        myCat() {
          return { name: 'Garfield', breed: 'Ginger', age: 1 }
        },
        hello() {
          return 'world!'
        }
      }
    }
   ```

3. **Schema as String template literals** - schemas can be written as string template literals like this:

```javascript
const rootSchema = `
    type Cat{
      name: String
      breed: String
      age: Int!
    }
    type Query{
      myCat: Cat
      hello: String
    }
    schema {
      query: Query
    }
  `
  // seems like schema{} type is only required to be defined in string literals only
```

## Init Apollo Server
---------------------
* The graphql schema will be used to init the apollo server like below. 
* Note that query functions in resolver are based on those defined in the schema.
```javascript
const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: {
      Query: {
        myCat() {
          return { name: 'Garfield', breed: 'Ginger', age: 1 }
        },
        hello() {
          return 'world!'
        }
      }
    },
    async context({ req }) {
      const user = await authenticate(req)
      return { user }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
```


## Graphql Client e.g. Graphql Playground
-----------------------------------------
graphql clients can customized the output and return any fields they like, as long as: 
1. it's defined on the schema, 
2. the function is available in the resolvers:

```javascript
# Write your query or mutation here
{
  myCat { //calls myCat() defined in resolver
    name
    age
    breed
  }
  hello
}
```
data output will be like this:
```javascript
{
  "data": {
    "myCat": {
      "name": "Garfield",
      "age": 1,
      "breed": "Ginger"
    },
    "hello": "world!"
  }
}
```


## Dev-Tools and libraries
--------------------------
### 1. Nodemon
library that allows you to monitor file changes and execute command like yarn restart to respond to file changes
```javascript - package.json
    {
        "dev": "nodemon --exec yarn restart"
    }
```
