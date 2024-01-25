const chai = require('chai');
const supertest = require('supertest');
const app = require('C:/Users/Pc/Desktop/Coderhouse/backend Coderhouse/desafio10backend/src/app.js'); 
const expect = chai.expect;
const request = supertest(app);

describe('Testing Product Router', () => {
  it('Debería obtener todos los productos', (done) => {
    request.get(mockingModule)('api/products')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Debería obtener un producto específico por su ID', (done) => {
    const productId = '653c88d924416bae2bde79af'; 
    request.get(`/api/products/${productId}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.equal(productId);
        done();
      });
  });

  it('Debería agregar un nuevo producto', (done) => {
    const newProduct = {
      
    };

    request.post('/api/products')
      .send(newProduct)
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        
        done();
      });
  });
});
