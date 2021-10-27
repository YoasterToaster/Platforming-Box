$(function() {
    //assigning variables from html elements
    const $player = $('#player');
    const $obstacle = $('.obstacleA');
    const $obstacleB = $('.obstacleB');
    const $floor = $('.floor');
    const $finishLine = $('#finishLine');

    //assigning arrays to take the positions of html elements
    let playerPosition = [getPixel($player.css('left')), getPixel($player.css('top'))];
    const floorPosition = [0, getPixel($floor.css('top'))];
    //assigning variables
    let distance = 0;
    let levelMeter = 0;
    let level = 1;
    let obstacleHeightDecrease = 5;
    let obstacleAHeight = $obstacle.css('height');
    let obstacleAPosition = $obstacle.css('top');
    let obstacleBHeight = $obstacleB.css('height');
    let obstacleBPosition = $obstacleB.css('top');
    let obstacleHeightIncrease = 5;
    let gameOver = false;
    let jump = false;
    const score = [5, 3, 4, 1, 2];



    //Turns a pixel measurement into an integer
    function getPixel(pix) {
        return parseInt(pix.substring(0, pix.length - 2));
    }
    //detects whether if there isn't a collision between two items
    function noCollision(itemA, itemB) {
        if ((getPixel(itemA) + 50) != getPixel(itemB)) {
            return true;
        }
    }
    //detects if there is a collision within a square radius
    function collision(player, object, thickness = 40) {
        if ((getPixel(player) + 50) > getPixel(object) && getPixel(player) + 50 < getPixel(object) + thickness) {
            return true;
        }
    }


    //Allows the box to jump when pressed
    $(window).keypress(function(e) {
        if (e.which == 32) {
            let jumpTick = 0;
            if (gameOver === false) {
                if (playerPosition[1] === (floorPosition[1] - 50)) {
                    console.log("jump is on");
                    jump = true;
                    jumpTimer = window.setInterval(function() {
                        if (jumpTick < 20) {
                            jumpTick++;
                            $player.css('top', (playerPosition[1] -= 8) + 'px');
                        } else {
                            jump = false;
                            clearTimeout(jumpTimer);
                            console.log("jump is off");
                        }
                    }, 20);
                }
            }
        }
    });
    //makes the player constantly move
    function playerMove() {
        distance += 7;
        $player.css('left', `${distance}` + 'px');
    }
    //This is where everything comes into play, every 20 milliseconds something happens
    let overworldTimer = window.setInterval(function() {
        //if gameOver is true, the game will halt until the user selects try again or refreshes the page
        if (gameOver === false) {
            //tracks every change in position and stores it in the playerPosition array
            playerPosition = [getPixel($player.css('left')), getPixel($player.css('top'))];
            playerMove();
            //if there is no collision then gravity will push the character downwards
            if (noCollision($player.css('top'), $floor.css('top')) && jump == false) {
                playerPosition[1] += 8;
                $player.css('top', `${playerPosition[1]}` + 'px');
            }
            //changes the header text if either of the objects get hit or the finish line is crossed, makes the player stop after any of these interactions activate
            if (collision($player.css('left'), $obstacle.css('left'), 80) && collision($player.css('top'), $obstacle.css('top'), 150) || collision($player.css('left'), $obstacleB.css('left'), 80) && collision($player.css('top'), $obstacleB.css('top'), 150)) {
                $('h2').text('Game Over');
                $('h2').css('color', 'red');
                $('h2').css('font-size', '90px');
                $('h2').css('left', '35%');
                $('h2').css('font-family', `'Anton', sans-serif`);
                $('input[type=submit]').css('visibility', 'visible');
                gameOver = true;

                for (i = 0; i < score.length; i++) {
                    console.log(score[i]);
                }

                //the above two should be combined into one and a high score table should appear when the player loses


                // Checks if the player crossed the finish line and makes sure that it doesn't run the same line of
            } else if ((playerPosition[0]) > getPixel($finishLine.css('left'))) {
                // resets the distance the player has travelled
                distance = 0;

                console.log(level);
                // The 0.5 is temporary since it counts twice for some reason (if a solution can not be found set a flag so that when it counts to 2 you add 1 level becausue 0.5 shows in the level count and it looks bad)
                levelMeter += 0.5;
                
                //Displays that the level is going up
                if (levelMeter == 1){
                    level++;
                    $('h1').text('Level ' + level);
                    console.log(level);
                    levelMeter = 0;
                }

                //Makes sure that these values are the correct amount for the next calculations
                obstacleAHeight = $obstacle.css('height');
                obstacleBHeight = $obstacleB.css('height');
                obstacleAPosition = $obstacle.css('top');
                obstacleBPosition = $obstacleB.css('top');
                playerPosition[0] = 0;


                // Stops the height from increasing after level 7
                if (level < 7){
                    //Makes the height of both obstacles increase slightly
                    $obstacle.css('height', (getPixel(obstacleAHeight) + obstacleHeightIncrease) + 'px');
                    $obstacleB.css('height', (getPixel(obstacleBHeight) + obstacleHeightIncrease) + 'px');

                    //Makes the position of the obstacles stay in the same spot given the increased heights
                    $obstacle.css('top', (getPixel(obstacleAPosition) - obstacleHeightDecrease) + 'px');
                    $obstacleB.css('top', (getPixel(obstacleBPosition) - obstacleHeightDecrease) + 'px');
                    console.log($obstacle.css('height'));
                }
                //Update  the high score of the game if the level was higher than the previous top 10

            }
            //makes sure that the player will never be below the floor
            if ((playerPosition[1] + 50) >= getPixel($floor.css('top'))) {
                $player.css('top', (floorPosition[1] - 50) + 'px');
            }
        }
    }, 20);
});
