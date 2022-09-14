/* when container opens */
DROP TABLE IF EXISTS Games CASCADE;
CREATE TABLE IF NOT EXISTS Games(
  GameCode INT,
  UsersInGame VARCHAR(45),
  CurrentImage VARCHAR(45),
  ImageTimeStamp DATETIME
)

DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE IF NOT EXISTS Users(
    UserID SERIAL,
    GameCode INT,
    UserName VARCHAR(45),
    UserScore INT
);

/* when user1 creates game */
INSERT INTO Games(GameCode,UsersInGame,CurrentImage,ImageTimeStamp)
VALUES(*game_code*,*user1_name*,'*blank_image*',*zero_time*)

INSERT INTO Users(GameCode,UserName,UserScore)
VALUES(*game_code*,*user1_name*,0)

/* when users join game */
UPDATE Games
SET UsersInGame = '*user_names*'
WHERE GameCode = *game_code*

INSERT INTO Users(GameCode,UserName,UserScore)
VALUES(*game_code*,*user_name*,0)

/* when image updates */
UPDATE Games
SET CurrentImage = '*image_location*', ImageTimeStamp = *current_time*
WHERE GameCode = *game_code*

/* when game ends */
UPDATE Users
SET UserScore = *new_score*
WHERE UserName = '*winner_user_name*'

UPDATE Games
SET CurrentImage = '*blank_image*', ImageTimeStamp = *zero_time*
WHERE GameCode = *game_code*

/* when games end */
DELETE FROM Users WHERE GameCode = *game_code*
DELETE FROM Games WHERE GameCode = *game_code*
