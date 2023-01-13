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


export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
/**
 * @swagger
 * /api/Investment_Banking:
 *   get:
 *     summary: List of Projects in Investment banking
 *     description: Returns the list of all projects under investment banking from MongoDB database
 *     responses:
 *       '200':
 *          content: 
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Project'
 *          description: List of project under investment banking from MongoDB database
 */
if(req.method=='GET'){
  const client= await MongoClient.connect('mongodb+srv://sdcode001:j92txQCN7mUJWGmx@cluster0.3yr72o9.mongodb.net/BankDatabase?retryWrites=true&w=majority')
  const db=client.db()
  const result=await db.collection('Investment_banking').find().toArray()
  client.close()
  res.status(201).json(result)
}

}
