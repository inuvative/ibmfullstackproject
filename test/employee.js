//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

let DB=require('../routes/employee').DATABASE;

chai.use(chaiHttp);
//Our parent block
describe('API tests', () => {
    beforeEach((done) => { 
        DB['1']= { _id : '1', firstName: "Carl", lastName: "James", hireDate: '2012-01-01', role: 'CEO' };
        DB['2']= { _id : '2',firstName: "Mary", lastName: "Lane", hireDate: '2018-03-23', role: 'VP' };
        DB['3']= { _id : '3',firstName: "Lou", lastName: "Byrd", hireDate: '2019-04-15', role: 'MANAGER' };
        DB['4']= { _id : '4',firstName: "George", lastName: "Tate", hireDate: '2022-07-30', role: 'LACKEY'}; 
        done();           
    });
 /*
  * Test the /GET route
  */
  describe('/GET employees', () => {
      it('it should GET all the employees', (done) => {
        chai.request(server)
            .get('/api/employees')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(4);
              done();
            });
      });
  });
 
 /*
  * Test the /POST route
  */
 describe('/POST employee', () => {
    it('it should not POST a employee without role field', (done) => {
        let emp = {
            firstName: "Joe",
            lastName: "Tolkien",
            hireDate: "1999-09-15",            
        }
      chai.request(server)
          .post('/api/employees')
          .send(emp)
          .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.be.a('array');
                res.body.errors.length.should.be.eql(1);
            done();
          });
    });

  });
  describe('/GET/:id employee', () => {
    it('it should GET a employee by the given id', (done) => {
        chai.request(server)
          .get('/api/employees/2')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('firstName');
                res.body.should.have.property('lastName');
                res.body.should.have.property('hireDate');
                res.body.should.have.property('role');
                res.body.should.have.property('_id').eql('2');
            done();
          });
    });
  });
  describe('/PUT/:id employee', () => {
    it('it should UPDATE a employee given the id', (done) => {
        chai.request(server)
            .put('/api/employees/3')
            .send({lastName: "Michales", role:"VP"})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('lastName').eql("Michales");
                res.body.should.have.property('role').eql("VP");                
            done();
        });
    });
  });
  describe('/DELETE/:id employee', () => {
    it('it should DELETE a employee given the id', (done) => {        
        chai.request(server)
            .delete('/api/employees/4')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');                
            done();
        });
    });
  });
});