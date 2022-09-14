# Drawchat
# CSCI-3308-Fall21-015-08

**Description**
 
Draw Chat™  is an exciting social experience that will allow users to draw pictures back and forth with their friends. The application will have a kahoot-like format where users will enter themselves into a game with other users. Once all users join the game, and indicate that they are ready to begin, one member will be prompted to draw something from a list that we will provide. The other users will receive updates of the drawers drawing every one second, and be prompted to keep guessing until they guess correctly or the 30 second timer runs out.

If a guessing user guesses correctly, they will receive a score based on how long it took them to input the correct answer. Once the timer has run out, all users will be brought to a page where they are asked if they would like to play again or end the game. Should they select to continue the game, they will be brought back to the start page where all of the users will be displayed. When they begin again from there, a new user will be given the drawing responsibility. Otherwise, if they select to end the game, they
will be brought to a page that will display the scores of all of the users. 



**How to Use**

All of the source code is stored in the 'V2' folder within this repository (https://github.com/CU-CSCI-3308-Fall-2021/CSCI-3308-Fall21-015-08/tree/main/V2). For users using the app, since it has been deloyed to heroku, all they need to do is navigate to https://draw-chat-csci3308.herokuapp.com/ to use the app. For editting and deploying the code, more involved steps must be folowed as outlined here.                                                                                                                
** Note: This project cannot be run locally due to the instances of AWS S3 for data transfer, it must be uploaded to heroku 
 
1. Download the repository onto a local enviroment using git clone https://github.com/CU-CSCI-3308-Fall-2021/CSCI-3308-Fall21-015-08.git
2. Navigate into the V2 folder within the local terminal 
3. If Heroku has not been installed on the local machine use the following 3 commands  

- sudo snap install --classic heroku
- brew tap heroku/brew && brew install heroku
- heroku login (this will open up a browser where you can login to your account)

4. heroku auth:token
- This will give you a token that you must paste into the .env file in /heroku/.env 
5. heroku container:login
6. heroku container:push web -a draw-chat-csci3308
7. heroku container:release web -a draw-chat-csci3308
8. At this point the app has been released and if yu go to the link above all of the updates to the code will be there or you can run heroku open -a draw-chat-csci3308 to open



**Submission Locations** 

- Source Code: https://github.com/CU-CSCI-3308-Fall-2021/CSCI-3308-Fall21-015-08/tree/main/Source%20Code
- Video Demo: https://github.com/CU-CSCI-3308-Fall-2021/CSCI-3308-Fall21-015-08/blob/main/Video%20Demo/video.txt
- Test Cases: https://github.com/CU-CSCI-3308-Fall-2021/CSCI-3308-Fall21-015-08/tree/main/Test_Cases
