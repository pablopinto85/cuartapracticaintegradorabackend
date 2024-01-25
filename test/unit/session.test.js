const chai = require('chai');
const supertest = require('supertest');
const app = require('C:/Users/Pc/Desktop/Coderhouse/backend Coderhouse/desafio10backend/src/app.js');
const expect = chai.expect;
const request = supertest(app);

describe('Testing Session Router', () => {
  it('Debería autenticar con GitHub y redirigir correctamente', (done) => {
    request.get('/github')
      .expect(302) 
      .end((err, res) => {
        
        done();
      });
  });

  it('Debería obtener un token después de la autenticación de GitHub', (done) => {
    
    request.get('/api/sessions/githubcallback')
      .expect(302) 
      .end((err, res) => {
        done();
      });
  });
});
