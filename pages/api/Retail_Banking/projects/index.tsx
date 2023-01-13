// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userID:
 *           type: string
 *           description: The employee userID.
 *           example: sdcode001
 *         name:
 *           type: string
 *           description: The employee name.
 *           example: "Souvik Dey"
 *         email:
 *           type: string
 *           description: Email ID of employee.
 *           example: "souvikdey@mail.com"
 *         password:
 *           type: string
 *           description: Password set by employee.
 *           example: "gfuyfy@787" 
 */
type User = {
    userID:string
    name: string
    email:string
    password:string
  }



/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the project.
 *           example: project1
 *         IT_dept:
 *           type: array
 *           description: List of employee under IT dept.
 *           items:
 *              ref: '#/components/schemas/User'  
 *         Account_dept:
 *           type: array
 *           description: List of employee under Account dept.
 *           items:
 *              ref: '#/components/schemas/User'  
 *         Debt_dept:
 *           type: array
 *           description: List of employee under Debt dept.
 *           items:
 *              ref: '#/components/schemas/User'   
 *         HR_dept:
 *           type: array
 *           description: List of employee under HR dept.
 *           items:
 *              ref: '#/components/schemas/User'  
 */
type Project={
    name:string
    IT_dept:User[]
    Account_dept:User[]
    Debt_dept:User[]
    HR_dept:User[]
}
/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectName:
 *       type: object
 *       properties:
 *         project_name:
 *           type: string
 *           description: Name of the new project.
 *           example: project1
 */
type ProjectName={
  project_name:string
}

/** 
 * @swagger
 *  /api/Retail_Banking/projects:
 *    post:
 *      summary: Insert a Projet object under Retail_Banking to MongoDB database.
 *      description: this api is used to insert a Projet object under Retail_Banking to MongoDB database
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/ProjectName' 
 *      responses:
 *        '200':
 *          description: Inserted successfully 
 *          
*/
async function ProjectHandler(req: NextApiRequest, res: NextApiResponse<{}>) {
    if(req.method=='POST'){
       const project_name=req.body.project_name
       let project:Project
       project={name:project_name,IT_dept:[],Account_dept:[],Debt_dept:[],HR_dept:[]}
       const client= await MongoClient.connect('mongodb+srv://sdcode001:j92txQCN7mUJWGmx@cluster0.3yr72o9.mongodb.net/BankDatabase?retryWrites=true&w=majority')
       const db=client.db()
       const result=await db.collection('Retail_banking').insertOne(project)
       client.close()
       console.log({message:'Project inserted',databse_status:result})
       res.status(201).json(result)
    }
/** 
 * @swagger
 *  /api/Retail_Banking/projects:
 *    get:
 *      summary: Get the details of a project under Retail_Banking by its name.
 *      description: Get the details of a project under Retail_Banking by its name from MongoDB database.
 *      parameters:
 *        - in: query
 *          name: project_name
 *          schema:
 *            type: string
 *          description: Name of the project which is needed.
 *      responses:
 *        '200':
 *          description: project detail found.
 *          content: 
 *            application/json:
 *              schema:
*/
    else if(req.method=='GET'){
      const items=req.url?.split('=')
      const project_name=items?.at(1)
      console.log(project_name)
      const client= await MongoClient.connect('mongodb+srv://sdcode001:j92txQCN7mUJWGmx@cluster0.3yr72o9.mongodb.net/BankDatabase?retryWrites=true&w=majority')
      const db=client.db()
      const result=await db.collection('Retail_banking').findOne({name:project_name})
      client.close()
      console.log(result)
      if(result){res.status(201).json(result)}
      else{res.status(201).json({error:'No project found!...'})}
      
    }
    /** 
 * @swagger
 *  /api/Retail_Banking/projects:
 *    delete:
 *      summary: Delete a project under Retail_Banking by its name.
 *      description: Delete a project under Retail_Banking by its name from MongoDB database.
 *      parameters:
 *        - in: query
 *          name: project_name
 *          schema:
 *            type: string
 *          description: Name of the project which has to be deleted.
 *      responses:
 *        '200':
 *          description: project Deleted.
 *          content: 
 *            application/json:
 *              schema:
*/
    else if(req.method=='DELETE'){
      const items=req.url?.split('=')
      const project_name=items?.at(1)
      console.log(project_name)
      const client= await MongoClient.connect('mongodb+srv://sdcode001:j92txQCN7mUJWGmx@cluster0.3yr72o9.mongodb.net/BankDatabase?retryWrites=true&w=majority')
      const db=client.db()
      const result=await db.collection('Retail_banking').deleteOne({name:project_name})
      client.close()
      res.status(201).json({message:'Project deleted',databse_status:result})
    }

}

export default ProjectHandler