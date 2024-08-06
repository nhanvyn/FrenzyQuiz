const dotenv = require("dotenv");
const request = require('supertest');
const { app, pool } = require('../server');

describe('Insert and delete a question', () => {
    let quizId;
    const testUserId = "5Dw10gT1FicYVWv5q6LPGlRBtaB3"
  
    beforeAll(async () => {
      // before insert new quiz, check if there is already a quiz with the same name, if there is just use the quizId of the existing quiz
      const checkResult = await pool.query(`SELECT * FROM quizzes WHERE tname = 'Fake Test Quiz'`);
      if (checkResult.rows.length > 0) {
        quizId = checkResult.rows[0].quizid;
        console.log("quiz already exists", quizId);
      } else {  
        // Insert a quiz to reference in question creation
        const result = await pool.query(`
          INSERT INTO quizzes (uid, tname, created) VALUES ($1, $2, $3) RETURNING quizid;
        `, [testUserId, 'Fake Test Quiz', new Date().toISOString()]);
        quizId = result.rows[0].quizid;
        console.log("insert new quiz",quizId); // Ensure the quiz ID is being retrieved correctly
      }
    });
  
    afterAll(() => pool.end)
    
    it('should create, retrieve, and delete a multiple choice question', async () => {
      // // Create a new question
      const createResponse = await request(app)
        .post('/createQuestion')
        .send({
          type: 'multiple',
          question: 'What is 2+2?',
          answer: '4',
          o1: '1',
          o2: '2',
          o3: '3',
          o4: '4',
          time: 30,
          points: 10,
          id: quizId,
          qnum: 1,
        });
      expect(createResponse.statusCode).toBe(200);
      console.log("createResponse body", createResponse.body);
  
      
      const getResponse = await request(app).get(`/getQuestion/${quizId}/${createResponse.body.id}/multiple`);
      expect(getResponse.statusCode).toBe(200);
      console.log("getResponse body", getResponse.body);
      // expect(getResponse.body[0]).toHaveProperty('question', 'What is 2+2?');
  
      
      const deleteResponse = await request(app).delete(`/deleteQuestion/${quizId}/${createResponse.body.id}/multiple/1`);
      expect(deleteResponse.statusCode).toBe(200);
      console.log("deleteResponse body", deleteResponse.body);

    });
  });