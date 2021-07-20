import { success, error } from 'consola';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import http from 'http'
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import AppModels from './models';
import {schemaDirectives} from './authantication/auth';
import {
    DB,
    PORT,
    SECRET
} from './config'
import { resolvers, typeDefs } from './graphql/index'

 import jwt from 'jsonwebtoken';

const app = express();
app.use(cors())
const tokUser = async (req) => {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
        try {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1]
            const me = await jwt.verify(bearerToken, SECRET)

            let user = await AppModels.User.findById(me._id).populate([
                {path: 'role', select: 'Rolename'}
            ])
     ;
            return user

        } catch (e) {
            console.log("errreeeerr",e);
            throw new AuthenticationError('Session Invalid or expired.')
        }
 }
 }






const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    
    context: async ({ req, connection }) => {
        if (connection) {
            return {
                ...AppModels
            }
        }
        if (req) {
             const me = await tokUser(req)
            return {
                 me,
                 secret: SECRET,
                 req,
                ...AppModels,
            }
        }
    },

})

server.applyMiddleware({ app, path: '/graphql' });

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const StartMyServer = async () => {
    try {
        await mongoose.connect(DB, options)
        
        
            AppModels.Role.findOne({ Rolename: "admin" }).exec(async (err, res) => {
                if (err)
                    console.log(err)
                else if (!res) {
                    const roleData = AppModels.Role({
                        Rolename: "admin"
                    })
    
                        await roleData.save();
                }
               
            });
            
   

 let role = await  AppModels.Role.findOne({ Rolename: "admin" })
  AppModels.User.findOne({Email:"Admin12@gmail.com"}). exec(async(err,res)=>{
    if(err)
      console.log(err)
      else if(!res){

            const data = AppModels.User({
                Firstname:"Admin",
                Lastname:"Admin",
                Email:"Admin12@gmail.com",
                Password:"333",
                role:role._id,
            })
            
              await  data.save();
          }
  })


        success({
            badge: true,
            message: `Server connect to database`
        })
        httpServer.listen(PORT, () => {
            success({
                badge: true,
                message: `Server Start complete ${PORT}`
            })
        })
    } catch (error) {
        ({
            badge: true,
            message: error.message
        })
    }
}
StartMyServer();