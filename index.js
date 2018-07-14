Matter.use('matter-collision-events');

window.addEventListener('load', function () {
    //Fetch our canvas
    var canvas = document.getElementById('world');

    //Setup Matter JS
    var engine = Matter.Engine.create();
    var world = engine.world;
    var render = Matter.Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: 500,
            height: 500,
            background: 'white',
            wireframes: false,
            showAngleIndicator: false
        }
    });

    var buckets = [];

    //Add a floor
    var floor = Matter.Bodies.rectangle(250, 520, 500, 40, {
        isStatic: true, //An immovable object
        label: 'floor',
        render: {
            visible: false
        }
    });
    Matter.World.add(world, floor);

    // add a roof
    var roof = Matter.Bodies.rectangle(250, -40, 500, 40, {
        isStatic: true, //An immovable object
        label: 'roof',
        render: {
            fillStyle: '#eee'
        }
    });
    Matter.World.add(world, roof);

    //right wall
    var rightWall = Matter.Bodies.rectangle(520, 250, 40, 500, {
        isStatic: true,
        label: 'rightWall',
        render: {
            fillStyle: '#eee',
            strokeStyle: 'black'
        }
    });
    Matter.World.add(world, rightWall);

    //left wall
    var leftWall = Matter.Bodies.rectangle(-40, 250, 40, 500, {
        isStatic: true,
        label: 'leftWall',
        render: {
            fillStyle: '#eee',
            strokeStyle: 'black'
        }
    });
    Matter.World.add(world, leftWall);


    //draw pegs
    offset = false;
    for (i = 50; i < 450; i += 50) {
        for (j = offset ? 50 : 25; j < 500; j += 50) {
            var peg = Matter.Bodies.circle(j, i, 5, {
                density: 0.04,
                friction: 0.01,
                isStatic: true,
                label: 'peg',
                render: {
                    fillStyle: 'purple',
                    strokeStyle: 'black',
                    lineWidth: 1
                }
            });
            Matter.World.add(world, peg);

        }
        offset = !offset;
    }

    //draw buckets
    for (i = 50; i < 500; i += 50) {
        var bucket = Matter.Bodies.rectangle(i, 475, 5, 50, {
            isStatic: true,
            label: 'bucket',
            render: {
                fillStyle: 'red',
                strokeStyle: 'black'
            }
        });
        buckets.push(bucket);
        Matter.World.add(world, bucket);
    }


    //Make interactive
    var mouseConstraint = Matter.MouseConstraint.create(engine, { //Create Constraint
        element: canvas,
        constraint: {
            render: {
                visible: false
            },
            stiffness: 0.8
        }
    });
    Matter.World.add(world, mouseConstraint);

    //Start the engine
    Matter.Engine.run(engine);
    Matter.Render.run(render);


    document.getElementById('world').addEventListener('click', function (event) {
        x = event.clientX;
        y = event.clientY;
        if (x > 0 && x < 500 && y > 0 && y < 50) {
            //Add a ball
            var ball = Matter.Bodies.circle(x, y, 15, {
                density: 0.04,
                friction: 0.01,
                frictionAir: 0.00001,
                restitution: 0.6,
                label: 'ball',
                render: {
                    fillStyle: '#F35e66',
                    strokeStyle: 'black',
                    lineWidth: 1
                }
            });
            ball.onCollide(function (pair) {
                if (pair.bodyA.label === "floor" || pair.bodyB.label === "floor") {
                    bucketsLeftOfBall = buckets.slice(0,Math.ceil(ball.position.x/50)-1);
                    bucketsRightOfBall = buckets.slice(Math.ceil(ball.position.x/50),buckets.length-1);

                    bucketsLeftOfBall.forEach(function(bucketLeftOfBall){
                        bucketLeftOfBall.render.fillStyle = "green";
                    });
                    bucketsRightOfBall.forEach(function(bucketRightOfBall){
                        bucketRightOfBall.render.fillStyle = "red";
                    });
                }
            });
            Matter.World.add(world, ball);
        }
    });


    var context = canvas.getContext("2d");
    context.fillStyle = "blue";
    context.font = "bold 16px Arial";
    context.fillText("Hello World!", (canvas.width/2), (canvas.height/2));

});
