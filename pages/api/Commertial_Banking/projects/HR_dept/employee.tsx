// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
/**
 * @swagger
 * components:
 *   schemas:
 *     Insert_Emp:
 *       type: object
 *       properties:
 *         in_project:
 *           type: string
 *           description: Name of the project where this employee to be inserted.
 *           example: project1
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
type Insert_Emp={
    in_project:string
    userID:string
    name: string
    email:string
    password:string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Delete_Emp:
 *       type: object
 *       properties:
 *         from_project:
 *           type: string
 *           description: Name of the project from where this employee to be Deleted.
 *           example: project1
 *         emp_userID:
 *           type: string
 *           description: userID of employee.
 *           example: sdcode001 
 */
type Delete_Emp={
    from_project:string
    emp_userID:string
}


type User = {
  userID:string
  name: string
  email:string
  password:string
}



export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>){
/** 
 * @swagger
 *  /api/Commertial_Banking/projects/HR_dept/employee:
 *    post:
 *      summary: Insert an employee in HR Dept of the project mentioned under of Commertial_Banking.
 *      description: this api is used to insert an employee in HR Dept of the project mentioned under of Commertial_Banking to MongoDB database
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/Insert_Emp' 
 *      responses:
 *        '200':
 *          description: Inserted successfully 
 *          
*/
  if(req.method=='POST'){
     const ins_obj=req.body
     const client= await MongoClient.connect('mongodb+srv://sdcode001:j92txQCN7mUJWGmx@cluster0.3yr72o9.mongodb.net/BankDatabase?retryWrites=true&w=majority')
      const db=client.db()
      const result=await db.collection('Commertial_banking').findOne({name:ins_obj.in_project})
      if(result!=null){
         const emp:User={userID:ins_obj.userID,name:ins_obj.name,email:ins_obj.email,password:ins_obj.password}
         result.HR_dept.push(emp)
         const result1=await  db.collection('Commertial_banking').replaceOne({name:ins_obj.in_project},result)
         client.close()
        console.log(result1)
        res.status(201).json({message:'Employee inserted',databse_status:result1})
      }
      else{
        client.close()
        res.status(404).json({error:'No such project found...'})
      }
  }
/** 
 * @swagger
 *  /api/Commertial_Banking/projects/HR_dept/employee:
 *    get:
 *      summary: Get the list of employee in HR dept of the project mentioned under of Commertial_Banking.
 *      description: Get the list of employee in HR dept of the project mentioned under of Commertial_Banking from MongoDB database.
 *      parameters:
 *        - in: query
 *          name: project_name
 *          schema:
 *            type: string
 *          description: Name of the project of which HR dept employees are needed.
 *      responses:
 *        '200':
 *          description: Employee list found.
 *          content: 
 *            application/json:
 *              schema:
*/
  else if(req.method=='GET'){
      const items=req.url?.split('=')
      const project_name=items?.at(1)
      const client= await MongoClient.connect('mongodb+srv://sdcode001:j92txQCN7mUJWGmx@cluster0.3yr72o9.mongodb.net/BankDatabase?retryWrites=true&w=majority')
      const db=client.db()
      const result=await db.collection('Commertial_banking').findOne({name:project_name})
      let list:User[]
      if(result){
          list=result.HR_dept
          client.close()
          res.status(201).json(list)
      }
      else{
        client.close()
        res.status(404).json({error:'project not found'})
      }
  }
  /** 
 * @swagger
 *  /api/Commertial_Banking/projects/HR_dept/employee:
 *    delete:
 *      summary: Delete an employee from HR Dept of the project mentioned under of Commertial_Banking.
 *      description: this api is used to delete an employee from HR Dept of the project mentioned under of Commertial_Banking in MongoDB database
 *      parameters:
 *        - in: query
 *          name: project_name
 *          schema:
 *            type: string
 *          description: Name of the project from which HR dept employees is to be remove.
 *        - in: query
 *          name: employee_userID
 *          schema:
 *            type: string
 *          description: usedID of the employee of HR dept of the project mentioned who has to be removed.
 *      responses:
 *        '200':
 *          description: Inserted successfully 
 *          
*/
  else if(req.method=='DELETE'){
    const items=req.url?.split('=')
    const items1=items?.at(1)?.split('&')
    const userID=items?.at(2)
    const project_name=items1?.at(0);
    const client= await MongoClient.connect('mongodb+srv://sdcode001:j92txQCN7mUJWGmx@cluster0.3yr72o9.mongodb.net/BankDatabase?retryWrites=true&w=majority')
      const db=client.db()
      const result=await db.collection('Commertial_banking').findOne({name:project_name})
      if(result!=null){
         const list=result.HR_dept
         let f=0
         for(let i=0;i<list.length;i++){
          if(list[i].userID==userID){list.splice(i,1); f=1; break}
         }
         result.HR_dept=list
         const result1=await  db.collection('Commertial_banking').replaceOne({name:project_name},result)
         client.close()
        console.log(result1)
        if(f==0){
          res.status(201).json({message:'No such employee found',databse_status:result1})
        }
        else{res.status(201).json({message:'Employee deleted',databse_status:result1})}
      }
      else{
        client.close()
        res.status(404).json({error:'No such project found...'})
      }      
  }
}
