const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../index'); // Replace this with the path to your Express app

chai.use(chaiHttp);

describe('User Routes', () => {
    describe('GET /get', () => {
        it('should get all users', (done) => {
            chai.request(app)
                .get('/user/get')
                .end((err: any, res: { body: any; }) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('POST /create', () => {
        it('should create a new user', (done) => {
            const user = {
                name: 'John',
                lastname: 'Doe',
                age: 30,
                username: 'johndoe',
                role: 'user',
                gender: 'male'
            };

            chai.request(app)
                .post('/user/create')
                .send(user)
                .end((err: any, res: { body: any; }) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    // Add similar tests for other routes (PUT /update, DELETE /delete)
});
