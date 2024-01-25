const chai = require('chai');
const supertest = require('supertest');
const app = require('C:/Users/Pc/Desktop/Coderhouse/backend Coderhouse/desafio10backend/src/app.js'); 
const request = supertest(app);

describe('Testing Cart Router', () => {
  it('Debería obtener todos los carritos', (done) => {
    request.get('/api/carts')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Debería obtener un carrito específico por su ID', (done) => {
    const cartId = '65aca6fce0c1c92a99b00c0a'; 
    request.get(`/api/carts/${cartId}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.equal(cartId);
        done();
      });
  });

  it('Debería agregar un nuevo carrito', (done) => {
    const newCart = {
      
    };

    request.post('/api/carts')
      .send(newCart)
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

