# An ESP GAME
1. Clone the repository on your system.
2. You will require nodeJS to run. Hence, install nodeJS by-                            
  brew install npm
3. You will require to run following npm commands in the directory for dependencies:                                     
  npm init                                                      
  npm install --save express socket.io                                     
  npm install fs                             
4. After installing all the dependencies use                                                                                
  node server.js                                                      
  to start the server at localhost:8080.
5. Use web browser to access localhost:8080 and use signup to create users.
6. Use another instance to localhost:8080 to create a match and kickstart the game.

                 ---------------------------------------------------------------                         
Features:
1. I have ensured all must haves have been checked.
2. I applied following extra features:                                                  
    a. The algorithm tries the to assign 2 of five images for which the users have given same answer.                    
    b. The algorithm prints a message on server console when 2 users reach consensus on all the question.

  --------------------------------------------------------------------------------------------------------
  
Optimisation Scope:                                                                                                
  1. I would have loved to integrate my app with sql database to store data but there were some handshaking protocol issues of nodejs with mysql and so could not do it this time.
  2. I would also like to improve its storage complexity as there are some storage redundacy and authentication method to make passwords secure.
  3. I would like to have in place the consensus algorithm which shows new options to players to lead players to consensus.
  4. I would like to introduce a more than 2 player mode to app. By allowing players to accept new players into game.
