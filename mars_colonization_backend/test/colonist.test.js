// Adjust chai import to dynamic import
import('chai').then(chai => {
    const chaiHttp = require('chai-http');
    const server = require('../server'); // Assuming server.js is the entry point
    const should = chai.should();

    chai.use(chaiHttp);

    describe('Colonists', () => {
        beforeEach((done) => {
            // Clear database before each test
            Colonist.deleteMany({}, (err) => {
                done();
            });
        });

        // Test the /GET route
        describe('/GET colonists', () => {
            it('it should GET all the colonists', (done) => {
                chai.request(server)
                    .get('/colonists')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                        done();
                    });
            });
        });

        // Test the /POST route
        describe('/POST colonist', () => {
            it('it should not POST a colonist without required fields', (done) => {
                let colonist = {
                    FirstName: 'John',
                    LastName: 'Doe'
                }
                chai.request(server)
                    .post('/colonists')
                    .send(colonist)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        done();
                    });
            });

            it('it should POST a colonist', (done) => {
                let colonist = {
                    ColonistID: 1,
                    FirstName: 'John',
                    MiddleName: 'A.',
                    LastName: 'Doe',
                    DateOfBirth: '1990-01-01',
                    Qualification: 'Engineer',
                    Age: 34,
                    EarthAddress: '123 Earth St.',
                    Gender: 'Male',
                    ContactNo: '123-456-7890',
                    CivilStatus: 'Single',
                    FamilyMembers: 2
                }
                chai.request(server)
                    .post('/colonists')
                    .send(colonist)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Colonist successfully added!');
                        res.body.colonist.should.have.property('FirstName');
                        done();
                    });
            });
        });

        // Test the /GET/:id route
        describe('/GET/:id colonist', () => {
            it('it should GET a colonist by the given id', (done) => {
                let colonist = new Colonist({
                    ColonistID: 1,
                    FirstName: 'John',
                    MiddleName: 'A.',
                    LastName: 'Doe',
                    DateOfBirth: '1990-01-01',
                    Qualification: 'Engineer',
                    Age: 34,
                    EarthAddress: '123 Earth St.',
                    Gender: 'Male',
                    ContactNo: '123-456-7890',
                    CivilStatus: 'Single',
                    FamilyMembers: 2
                });
                colonist.save((err, colonist) => {
                    chai.request(server)
                        .get('/colonists/' + colonist.id)
                        .send(colonist)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('FirstName');
                            res.body.should.have.property('LastName');
                            res.body.should.have.property('_id').eql(colonist.id);
                            done();
                        });
                });

            });
        });

        // Test the /PUT/:id route
        describe('/PUT/:id colonist', () => {
            it('it should UPDATE a colonist given the id', (done) => {
                let colonist = new Colonist({
                    ColonistID: 1,
                    FirstName: 'John',
                    MiddleName: 'A.',
                    LastName: 'Doe',
                    DateOfBirth: '1990-01-01',
                    Qualification: 'Engineer',
                    Age: 34,
                    EarthAddress: '123 Earth St.',
                    Gender: 'Male',
                    ContactNo: '123-456-7890',
                    CivilStatus: 'Single',
                    FamilyMembers: 2
                });
                colonist.save((err, colonist) => {
                    chai.request(server)
                        .put('/colonists/' + colonist.id)
                        .send({
                            FirstName: 'Jane',
                            LastName: 'Doe'
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message').eql('Colonist updated!');
                            res.body.colonist.should.have.property('FirstName').eql('Jane');
                            done();
                        });
                });
            });
        });

        // Test the /DELETE/:id route
        describe('/DELETE/:id colonist', () => {
            it('it should DELETE a colonist given the id', (done) => {
                let colonist = new Colonist({
                    ColonistID: 1,
                    FirstName: 'John',
                    MiddleName: 'A.',
                    LastName: 'Doe',
                    DateOfBirth: '1990-01-01',
                    Qualification: 'Engineer',
                    Age: 34,
                    EarthAddress: '123 Earth St.',
                    Gender: 'Male',
                    ContactNo: '123-456-7890',
                    CivilStatus: 'Single',
                    FamilyMembers: 2
                });
                colonist.save((err, colonist) => {
                    chai.request(server)
                        .delete('/colonists/' + colonist.id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message').eql('Colonist successfully deleted!');
                            done();
                        });
                });
            });
        });
    });
}).catch(err => {
    console.error('Error importing chai:', err);
});
