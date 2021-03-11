var inputForm = document.getElementById('form');
var output = document.getElementById('output');
var examplesSelection = document.getElementById("Selection");

var inputEx = [
    [
        [document.getElementById("00"), document.getElementById("10"), document.getElementById("20"), document.getElementById("30")],
        [document.getElementById("10"), document.getElementById("11"), document.getElementById("21"), document.getElementById("31")],
        [document.getElementById("20"), document.getElementById("21"), document.getElementById("22"), document.getElementById("32")],
        [document.getElementById("30"), document.getElementById("31"), document.getElementById("32"), document.getElementById("33")]
    ],
    [[
        document.getElementById("t"), document.getElementById("x1"), document.getElementById("x2"), document.getElementById("x3")
    ]],
    [[
        document.getElementById("ct"), document.getElementById("cx1"), document.getElementById("cx2"), document.getElementById("cx3")
    ]],
    [[
        document.getElementById("constants")
    ]],
    [
        [document.getElementById("1sphx"), document.getElementById("1sphy"), document.getElementById("1sphz"), document.getElementById("1sphR"), document.getElementById("1sphColor")]
    ]
]
var defaultObjects=[];

var exampleFlatSpace = [
    [
        ['-1', '0', '0', '0'],
        ['0', '1', '0', '0'],
        ['0', '0', '1', '0'],
        ['0', '0', '0', '1']
    ],
    [[
        't', 'x', 'y', 'z',
    ]],
    [[
        't', 'x', 'y', 'z'
    ]],
    [[
        ''
    ]],
    [
        ['0','0','0','0', "#111111"]
    ]
]
var exampleSchwarzschild = [
    [
        ['-(1-S/r)', '0', '0', '0'],
        ['0', '1/(1-S/r)', '0', '0'],
        ['0', '0', '(r^2)', '0'],
        ['0', '0', '0', 'r^2 * sin(a)^2']
    ],
    [[
        't', 'r', 'a', 'b',
    ]],
    [[
        't',
        'r*sin(a)*cos(b)',
        'r*sin(a)*sin(b)',
        'r*cos(a)'
    ]],
    [[
        'S'
    ]],
    [
        ['0','0','0','10', "#111111"]
    ]
]

var exampleSchwarzschildCartesian = [
    [
        ['-(1-S/(x^2+y^2+z^2)^0.5)^2/(1+S/(x^2+y^2+z^2)^0.5)^2', '0', '0', '0'],
        ['0', '(1+S/(x^2+y^2+z^2)^0.5)^4', '0', '0'],
        ['0', '0', '(1+S/(x^2+y^2+z^2)^0.5)^4', '0'],
        ['0', '0', '0', '(1+S/(x^2+y^2+z^2)^0.5)^4']
    ],
    [[
        't', 'x', 'y', 'z',
    ]],
    [[
        't',
        'x',
        'y',
        'z'
    ]],
    [[
        'S'
    ]],
    [
        ['0','0','0','10', "#111111"]
    ]
]


//ordered name of coordinates that are used in the metric tensor
var coordinatesNames = ['t', 'r', 'a', 'b'];
var metric = [
    ['-1', '0', '0', '0'],
    ['0', '1', '0', '0'],
    ['0', '0', '1', '0'],
    ['0', '0', '0', '1']
]
var transformation = [
    't',
    'r*sin(a)*cos(b)',
    'r*sin(a)*sin(b)',
    'r*cos(a)'
]
var variables = {};
var constants = '';

function OnChange(value=this.value) {
    if (value == '1') {
        for (var e = 0; e < inputEx.length; e++) {
            for (var i = 0; i < inputEx[e].length; i++) {
                for (var j = 0; j < inputEx[e][i].length; j++) {
                    inputEx[e][i][j].value = exampleFlatSpace[e][i][j];
                }
            }
        }
    }
    else if (value == '2') {
        for (var e = 0; e < inputEx.length; e++) {
            for (var i = 0; i < inputEx[e].length; i++) {
                for (var j = 0; j < inputEx[e][i].length; j++) {
                    inputEx[e][i][j].value = exampleSchwarzschild[e][i][j];
                }
            }
        }
    } else if (value == '3') {
        for (var e = 0; e < inputEx.length; e++) {
            for (var i = 0; i < inputEx[e].length; i++) {
                for (var j = 0; j < inputEx[e][i].length; j++) {
                    inputEx[e][i][j].value = exampleSchwarzschildCartesian[e][i][j];
                }
            }
        }
    }
}
examplesSelection.value='3';
OnChange('3');
examplesSelection.onchange = OnChange;


output.style.display = 'none';

document.getElementById('ready').onclick = () => {
    output.style.display = 'inline-block';
    document.body.style.overflow = 'hidden';
    for (var i = 0; i < inputEx[0].length; i++) {
        for (var j = 0; j < inputEx[0][i].length; j++) {
            metric[i][j] = inputEx[0][i][j].value;
        }
    }
    for (var i = 0; i < inputEx[1][0].length; i++) {
        coordinatesNames[i] = inputEx[1][0][i].value;
    }
    for (var i = 0; i < inputEx[2][0].length; i++) {
        transformation[i] = inputEx[2][0][i].value;
    }
    for (var i = 0; i < inputEx[3][0][0].value.length; i++) {
        variables[inputEx[3][0][0].value[i]] = 10;
    }
    for (var i = 0; i < inputEx[4].length; i++) {
        defaultObjects.push(new THREE.Mesh( new THREE.SphereGeometry( parseFloat(inputEx[4][i][3].value), 32, 32 ), new THREE.MeshBasicMaterial( {color: new THREE.Color(inputEx[4][i][4].value)} )))
        defaultObjects[i].position.set(parseFloat(inputEx[4][i][0].value), parseFloat(inputEx[4][i][1].value), parseFloat(inputEx[4][i][2].value))
    }

    document.getElementById('form').style.display = 'none';

    start()
}

function start() {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x00010a, 1);
    document.body.appendChild(renderer.domElement);

    var scene = new THREE.Scene();

    //defining camera
    var camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 0.001, 10000);
    camera.position.x = 100;
    camera.position.y = 100;
    camera.position.z = 100;
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableDamping = true;
    controls.DampingFactor = 0.0;

    window.addEventListener('resize', onWindowResize);
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        scene.add(sphere);
    


    var CANVAS_WIDTH = 180,
        CANVAS_HEIGHT = 180,
        CAM_DISTANCE = 300;
    // dom
    container2 = document.getElementById('inset');
    // renderer
    renderer2 = new THREE.WebGLRenderer();
    renderer2.setClearColor(0x00010a, 1);
    renderer2.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    container2.appendChild(renderer2.domElement);

    // scene
    scene2 = new THREE.Scene();

    // camera
    camera2 = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
    camera2.up = camera.up; // important!

    // axes
    axes2 = new THREE.AxesHelper(100);
    scene2.add(axes2);


    //light to see objects
    const generalLight = new THREE.AmbientLight(0xffffff)
    scene.add(generalLight);

    for(var i=0; i<defaultObjects.length;i++){
        scene.add(defaultObjects[i])
    }

    //geodesis
    var geodesis = []

    //menu
    var gui = new dat.gui.GUI();
    gui.domElement.id = 'gui';
    let start = false;
    var starter;
    var options = {
        start_stop: function () {
            if (start) {
                starter.name('start');
            }
            else {
                starter.name('stop');
            }
            start = !start;
        },
        add_random: function () {
            num=parseFloat(prompt("The amount of particles", "5"));
            for(var i=0; i<num; i++){
                addObject({
                    t: 0.0,
        x1: 70*(Math.random()*2-1),
        x2: 70*(Math.random()*2-1),
        x3: 70*(Math.random()*2-1),
        velt: 2,
        velx1: 200*(Math.random()*2-1),
        velx2: 200*(Math.random()*2-1),
        velx3: 200*(Math.random()*2-1),
        colort: "#ffeb00",
        radius: parseInt(Math.random()*2)
                })
            }
        }
    }
    starter = gui.add(options, 'start_stop');
    starter.name("start");
    gui.add(options, 'add_random').name("Add Random Particles");
    var consts = gui.addFolder("Constants");
    constantsNames = Object.keys(variables);
    for (var i = 0; i < constantsNames.length; i++) {
        consts.add(variables, constantsNames[i]).name(constantsNames[i])
    }
    var adding = gui.addFolder("Add Particle");
    var particlesList=gui.addFolder("List of Particles");
    var infoToAdd = {
        t: 0.0,
        x1: 0.0,
        x2: 0.0,
        x3: 0.0,
        velt: 1,
        velx1: 0.0,
        velx2: 0.0,
        velx3: 0.0,
        colort: "#ffeb00",
        radius: 1
    }
    //create one default object
    //addObject()
    //menu adding
    adding.add(infoToAdd, 't').name("t")
    adding.add(infoToAdd, 'x1').name("X1")
    adding.add(infoToAdd, 'x2').name("X2")
    adding.add(infoToAdd, 'x3').name("X3")
    adding.add(infoToAdd, 'velt').name("Velocity t")
    adding.add(infoToAdd, 'velx1').name("Velocity X1")
    adding.add(infoToAdd, 'velx2').name("Velocity X2")
    adding.add(infoToAdd, 'velx3').name("Velocity X3")
    adding.addColor(infoToAdd, 'colort').name("Color")
    adding.add(infoToAdd, 'radius').name("Particle's Radius")
    adding.add([addObject], 0).name("add")
    

    function addObject(source=infoToAdd) {
        geodesis.push({
            cd: [source.t, source.x1, source.x2, source.x3],
            vel: [source.velt, source.velx1, source.velx2, source.velx3],
            pre_vel: [], points: [], line: 0,
            color: source.colort,
            data: particlesList.addFolder("" + geodesis.length),
            radius: source.radius,
            sphere: new THREE.Mesh( new THREE.SphereGeometry( source.radius, 32, 32 ), new THREE.MeshBasicMaterial( {color: new THREE.Color(source.colort)} )),
            crashN: -1
        })
        time_c = geodesis[geodesis.length - 1].data.add(geodesis[geodesis.length - 1].cd, "0").name("t")
        time_c.listen()
        c1 = geodesis[geodesis.length - 1].data.add(geodesis[geodesis.length - 1].cd, "1").name("X1")
        c1.listen()
        c2 = geodesis[geodesis.length - 1].data.add(geodesis[geodesis.length - 1].cd, "2").name("X2")
        c2.listen()
        c3 = geodesis[geodesis.length - 1].data.add(geodesis[geodesis.length - 1].cd, "3").name("X3")
        c3.listen()
        vt = geodesis[geodesis.length - 1].data.add(geodesis[geodesis.length - 1].vel, "0").name("t")
        vt.listen()
        v1 = geodesis[geodesis.length - 1].data.add(geodesis[geodesis.length - 1].vel, "1").name("Velocity X1")
        v1.listen()
        v2 = geodesis[geodesis.length - 1].data.add(geodesis[geodesis.length - 1].vel, "2").name("Velocity X2")
        v2.listen()
        v3 = geodesis[geodesis.length - 1].data.add(geodesis[geodesis.length - 1].vel, "3").name("Velocity X3")
        v3.listen()
        colort = geodesis[geodesis.length - 1].data.addColor(geodesis[geodesis.length - 1], 'color').name("Color")
    }

    //global variables
    const dt = 0.001;//the smallest amount of time
    var time = 0.000;//what time is from the start
    //number of dimensions
    const dn = metric.length;
    var Christoffel = generateChristoffel(metric, invertMatrix(metric));
    function render() {
        requestAnimationFrame(render);
        if (start) {
            if(geodesis.length==0){
                options.start_stop();
                alert("Enter at least one test-particle");

            }else{
            geodesis = changeState(geodesis, variables);

            //updating path
            for (var count = 0; count < geodesis.length; count++) {
                cartesian = []
                scope = variables
                for (var cd_name = 0; cd_name < coordinatesNames.length; cd_name++) {
                    scope[coordinatesNames[cd_name]] = geodesis[count].cd[cd_name]
                    if (!scope[coordinatesNames[cd_name]])
                        scope[coordinatesNames[cd_name]]+= 0.000000000001
                }
                    for (var i = 0; i < transformation.length; i++)
                        cartesian.push(math.evaluate(transformation[i], scope))
                    if (geodesis[count].points.length > 0) {
                        if ((cartesian[1] != NaN && cartesian[2] != NaN && cartesian[3] != NaN) && (Math.pow((geodesis[count].points[geodesis[count].points.length - 1].x - cartesian[1]), 2) + Math.pow((geodesis[count].points[geodesis[count].points.length - 1].y - cartesian[2]), 2) + Math.pow((geodesis[count].points[geodesis[count].points.length - 1].z - cartesian[3]), 2) < 4000)){
                            geodesis[count].points.push(new THREE.Vector3(cartesian[1], cartesian[2], cartesian[3]));
                            geodesis[count].sphere.position.set(cartesian[1], cartesian[2], cartesian[3])
                        }
                    } else {
                        geodesis[count].points.push(new THREE.Vector3(cartesian[1], cartesian[2], cartesian[3]));
                        scene.add(geodesis[count].sphere)
                    }
                    if (geodesis[count].line != 0)
                        scene.remove(geodesis[count].line);
                    material = new THREE.LineBasicMaterial({ color: new THREE.Color(geodesis[count].color) });
                    geometry = new THREE.BufferGeometry().setFromPoints(geodesis[count].points);
                    geodesis[count].line = new THREE.Line(geometry, material);
                    scene.add(geodesis[count].line);
                }
            }

        }
        
        camera2.position.copy(camera.position);
        camera2.position.sub(controls.target);
        camera2.position.setLength(CAM_DISTANCE);

        camera2.lookAt(scene2.position);

        renderer.render(scene, camera);
        renderer2.render(scene2, camera2);
    }
        render();





        //updating objects
        function changeState(geodesis, parameters) {
            for (var count = 0; count < geodesis.length; count++) {
                geodesis[count].pre_vel = geodesis[count].vel
                for (var nu = 0; nu < dn; nu++) {
                    dvel = 0
                    for (var i = 0; i < dn; i++) {
                        for (var j = 0; j < dn; j++) {
                            scope = parameters
                            for (var cd_name = 0; cd_name < coordinatesNames.length; cd_name++) {
                                scope[coordinatesNames[cd_name]] = geodesis[count].cd[cd_name]
                                if (!scope[coordinatesNames[cd_name]])
                                    scope[coordinatesNames[cd_name]] += 0.000000000001
                            }
                            dvel += math.evaluate(Christoffel[nu][i][j], scope) * geodesis[count].pre_vel[i] * geodesis[count].pre_vel[j] * dt
                        }
                    }
                    geodesis[count].vel[nu] -= dvel;
                }
                //Euler method to calculate motion
                for (var nu = 0; nu < dn; nu++) {
                    geodesis[count].cd[nu] += (geodesis[count].vel[nu] + geodesis[count].pre_vel[nu]) / 2 * dt

                }}
                return geodesis;
                
        }


        //generating christoffel symbols
        function generateChristoffel(g, g_inv) {
            var L = math.zeros(dn, dn, dn)._data
            for (var nu = 0; nu < dn; nu++) {
                for (var i = 0; i < dn; i++) {
                    for (var j = 0; j < dn; j++) {

                        for (var m = 0; m < dn; m++) {
                            sum_der = math.string(math.derivative(g[j][m], coordinatesNames[i])) + "+" + math.string(math.derivative(g[m][i], coordinatesNames[j])) + "-" + math.string(math.derivative(g[i][j], coordinatesNames[m]))
                            L[nu][i][j] += "+(1/2*(" + g_inv[nu][m] + ")*(" + sum_der + "))";
                        }

                        L[nu][i][j] = math.string(math.simplify(L[nu][i][j]))
                    }
                }
            }
            return L;
        }

        //inverting matrix
        function invertMatrix(M) {
            if (M.length !== M[0].length) { return; }
            var i = 0, ii = 0, j = 0, dim = M.length, e = 0, t = 0;
            var I = [], C = [];
            for (i = 0; i < dim; i += 1) {
                I[I.length] = [];
                C[C.length] = [];
                for (j = 0; j < dim; j += 1) {
                    if (i == j) { I[i][j] = "1"; }
                    else { I[i][j] = "0"; }
                    C[i][j] = M[i][j];
                }
            }
            for (i = 0; i < dim; i += 1) {
                e = C[i][i];
                if (e == 0) {
                    for (ii = i + 1; ii < dim; ii += 1) {
                        if (C[ii][i] != 0) {
                            for (j = 0; j < dim; j++) {
                                e = C[i][j];
                                C[i][j] = C[ii][j];
                                C[ii][j] = e;
                                e = I[i][j];
                                I[i][j] = I[ii][j];
                                I[ii][j] = e;
                            }
                            break;
                        }
                    }
                    e = C[i][i];
                    if (e == 0) { return }
                }
                for (j = 0; j < dim; j++) {
                    C[i][j] = "" + C[i][j] + "/" + "(" + e + ")";
                    I[i][j] = "" + I[i][j] + "/" + "(" + e + ")";
                }
                for (ii = 0; ii < dim; ii++) {
                    if (ii == i) { continue; }
                    e = C[ii][i];
                    for (j = 0; j < dim; j++) {
                        C[ii][j] = "(" + C[ii][j] + "-(" + e + ")*" + C[i][j] + ")";
                        I[ii][j] = "(" + I[ii][j] + "-(" + e + ")*" + I[i][j] + ")";
                    }
                }
            }
            for (var i = 0; i < dim; i++) {
                for (var j = 0; j < dim; j++) {
                    I[i][j] = math.string(math.simplify(I[i][j]))
                }
            }
            return I;
        }
    }