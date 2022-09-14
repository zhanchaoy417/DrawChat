// Imports the server.js file to be tested.
const server = require("../Source Code/src/server");
// Assertion (Test Driven Development) and Should,  Expect(Behaviour driven
// development) library
const chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

describe("Server!", () => {

  //start/sign-on feature
  it("Success of game code generation and userId saving", (done) => {
    chai
      .request(server)
      .get("/home/game_code")
      .end((err,res) => {
        //expect(res).to.have.status(200);
        //expect(res.body.id).to.equals(1);
        //expect(res.body).to.have.property("name");
        //expect(res.body).to.have.property("sign");
        expect(res.body).to.have.property("gameCode");
        expect(res.body).to.have.property("userId");
        done();
      });
    });

    it("Success of username saving", (done) => {
      const info = {
        fname: 'testName'
      };
      chai
        .request(server)
        .post("/gameStart1")
        .send(info)
        .end((err,res) => {
          expect(res.body).to.have.property("users");
          done();
        });
      });

    it("Success of drawer page navigation", (done) => {
      const info = {
        GameCode: 111111,
        userid: 0
      };
      chai
        .request(server)
        .post("/gameStart1/beginGame")
        .send(info)
        .end((err,res) => {
          expect(res.body.my_title).to.equals("Drawing");
          done();
        });
      });

      it("Success of guesser page navigation", (done) => {
        const info = {
          GameCode: 111111,
          userid: 0
        };
        chai
          .request(server)
          .post("/gameStart2/beginGame")
          .send(info)
          .end((err,res) => {
            expect(res.body.my_title).to.equals("Guessing");
            done();
          });
        });

        //guessing feature
        it("Success of drawing update", (done) => {
          const info = {
            game_code: 111111
          };
          }
          chai
            .request(server)
            .post("/draw/update_image")
            .send(info)
            .end((err,res) => {
              expect(res).to.have.status(200);
              done();
            });
          });

          it("Success of correct guess rendering", (done) => {
            const info = {
              userid: 0,
              GameCode: 111111,
              scoreIn: 0
            };
            chai
              .request(server)
              .post("/guess/endGuess")
              .end((err,res) => {
                expect(res.body.my_title).to.equals("End");
                done();
              });
            });

            //scoring feature
            it("Success of timed score allocation", (done) => {
              const info = {
                gameCode: 111111
              };
              chai
                .request(server)
                .post("/after/see_scores")
                .end((err,res) => {
                  expect(res.body).to.have.property("data");
                  done();
                });
              });
});
