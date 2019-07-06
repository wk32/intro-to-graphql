import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { authenticate } from './utils/auth'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'

const types = ['product', 'coupon', 'user']

export const start = async () => {
  const rootSchema = `
    interface Animal{
      species: String
    }
    type Tiger implements Animal {
      species: String!
      stripeCount: Int
    }
    type Lion implements Animal {
      species: String!
      mainColor: String!
    }
    type Cat{
      name: String
      breed: String
      age: Int!
      bestFriend: Cat!
      owner:Owner!
    }
    input CatInput{
      name: String,
      age: Int!
      bestFriend: CatInput!
    }
    type Owner {
      name: String
      cat: Cat
    }
    type Query{
      animals: [Animal]!
      cat(name:String!): Cat!
      owner(name:String!): Owner!
      myCat: Cat
      hello: String
      cats: [Cat]
    }
    type Mutation{
      newCat(input: CatInput!): Cat!
    }
    schema {
      query: Query
      mutation: Mutation
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    // resolvers: merge({}, product, coupon, user),
    resolvers: {
      Query: {
        animals() {
          return [
            { species: 'Tiger', stripeCount: 2 },
            { species: 'Lion', mainColor: 'brown' }
          ]
        },
        cat(_, args, ctx, info) {
          console.log('in cat query resolver', info)
          // throw new Error('error!!!')
          return {}
          // console.log('in cat resolvers')
          // return { name: args.name, age: 3, owner: {} }
        },
        owner(_, args) {
          console.log('in owner query resolver')
          return {}
          // console.log('in owner resolvers')
          // return { name: args.name, cat: {} }
        },
        myCat() {
          return {
            name: 'Garfield',
            breed: 'Ginger',
            age: 1,
            bestFriend: {
              name: 'Oldie',
              breed: 'Grey Cat'
            }
          }
        },
        hello() {
          return 'world!'
        }
      },
      // resolver will evaluate types below as functions
      // so if a query function previously refer to a particular type such as Cat, it will run the query below
      Cat: {
        name() {
          return 'Daryl'
        },
        age() {
          console.log('in cat age')
          return 2
        },
        owner() {
          console.log('in cat owner')
          return {}
        }
      },
      Owner: {
        name() {
          console.log('in owner name')
          return 'Scott'
        },
        cat() {
          console.log('in owner cat')
          return {}
        }
      },
      Animal: {
        __resolveType(animal) {
          return animal.species
        }
      }
    },
    async context({ req }) {
      // const user = await authenticate(req)
      return { user }
    }
  })

  /*
  const server = new ApolloServer({
    typeDefs: [rootSchema, ...schemaTypes],
    resolvers: merge({}, product, coupon, user),
    context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })
  */
  // await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}

/**
 * WK: apollo server creates a graph ql server for us
 */
