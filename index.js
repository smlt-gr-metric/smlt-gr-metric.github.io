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
    ]]
]

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
    ]]
]
var exampleSchwarzschild = [
    [
        ['-(1-R/(x^2+y^2+z^2)^0.5)^2/(1+R/(x^2+y^2+z^2)^0.5)^2', '0', '0', '0'],
        ['0', '(1+R/(x^2+y^2+z^2)^0.5)^4', '0', '0'],
        ['0', '0', '(1+R/(x^2+y^2+z^2)^0.5)^4', '0'],
        ['0', '0', '0', '(1+R/(x^2+y^2+z^2)^0.5)^4']
    ],
    [[
        't', 'x', 'y', 'z',
    ]],
    [[
        't', 'x', 'y', 'z'
    ]]
]

//ordered name of coordinates that are used in the metric tensor
var coordinatesNames = 'txyz';
var metric = [
    ['-1', '0', '0', '0'],
    ['0', '1', '0', '0'],
    ['0', '0', '1', '0'],
    ['0', '0', '0', '1']
]

examplesSelection.onchange = function OnChange() {
    var value = this.value
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
    }
}
output.style.display = 'none';

document.getElementById('ready').onclick = ()=>{
    output.style.display = 'inline-block';
    document.body.style.overflow='hidden';
    for (var i = 0; i < inputEx[0].length; i++) {
            for (var j = 0; j < inputEx[0][i].length; j++) {
                metric[i][j] = inputEx[0][i][j].value;
            }
        }
        for (var i = 0; i < inputEx[1][0].length; i++) {
        coordinatesNames[i]=inputEx[1][0][i].value;
        }
        
    document.getElementById('form').style.display= 'none';
start()
}

function start() {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    var scene = new THREE.Scene();

    //defining camera
    var camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 0.1, 1000);
    camera.position.z = 100;
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableDamping = true;
    controls.DampingFactor = 0.0;

    //light to see objects
    const generalLight = new THREE.AmbientLight(0xffffff)
    scene.add(generalLight);

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

    }
    starter = gui.add(options, 'start_stop');
    starter.name("start");
    var adding = gui.addFolder("Add");
    var infoToAdd = {
        colort: "#ffeb00",
        t: 1,
        x1: -100,
        x2: 47,
        x3: 0,
        velt: 1,
        velx1: 100,
        velx2: 0,
        velx3: 0,
    }
    //create one default object
    addObject()
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
    adding.add([addObject], 0).name("add")
    function addObject() {
        geodesis.push({
            cd: [infoToAdd.t, infoToAdd.x1, infoToAdd.x2, infoToAdd.x3],
            vel: [infoToAdd.velt, infoToAdd.velx1, infoToAdd.velx2, infoToAdd.velx3],
            pre_vel: [], points: [], line: 0,
            color: infoToAdd.colort,
            data: gui.addFolder("" + geodesis.length)
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
    }

    //global variables
    const dt = 0.01;//the smallest amount of time
    var time = 0.000;//what time since the start

    var variables = {
        R: 15,
    }
    //number of dimensions
    const dn = metric.length;
    var Christoffel = generateChristoffel(metric, invertMatrix(metric));

    function render() {
        requestAnimationFrame(render);
        if (start) {
            geodesis = changeState(variables);

            //updating path
            for (var count = 0; count < geodesis.length; count++) {
                cartesian = toCartesian(geodesis[count].cd);
                geodesis[count].points.push(new THREE.Vector3(cartesian[1], cartesian[2], cartesian[3]));
                if (geodesis[count].line != 0)
                    scene.remove(geodesis[count].line);
                material = new THREE.LineBasicMaterial({ color: new THREE.Color(geodesis[count].color) });
                geometry = new THREE.BufferGeometry().setFromPoints(geodesis[count].points);

                geodesis[count].line = new THREE.Line(geometry, material);
                scene.add(geodesis[count].line);
            }
        }
        renderer.render(scene, camera);
    }
    render();
    //translation to cartesian
    function toCartesian(x) {
        return x;
    }










    //updating objects
    function changeState(parameters) {
        for (var count = 0; count < geodesis.length; count++) {
            geodesis[count].pre_vel = geodesis[count].vel
            for (var nu = 0; nu < dn; nu++) {
                for (var i = 0; i < dn; i++) {
                    for (var j = 0; j < dn; j++) {
                        scope = parameters
                        for (var cd_name = 0; cd_name < coordinatesNames.length; cd_name++)
                            scope[coordinatesNames[cd_name]] = geodesis[count].cd[cd_name]
                        geodesis[count].vel[nu] -= math.evaluate(Christoffel[nu][i][j], scope) * geodesis[count].pre_vel[i] * geodesis[count].pre_vel[j] * dt
                    }
                }
            }
            //Euler method to calculate motion
            for (var nu = 0; nu < dn; nu++) {
                geodesis[count].cd[nu] += (geodesis[count].vel[nu] + geodesis[count].pre_vel[nu]) / 2 * dt
            }
            return geodesis;
            /*
            [
                {
                    cd: [t, x1, x2, x3],
                    vel: [t, x1, ..],
                    pre_vel: [],
                }
            ]
            */
        }
    }


    //generating christoffel symbols
    function generateChristoffel(g, g_inv) {
        var L = math.zeros(dn, dn, dn)._data
        for (var nu = 0; nu < dn; nu++) {
            for (var i = 0; i < dn; i++) {
                for (var j = 0; j < dn; j++) {

                    for (var m = 0; m < dn; m++) {
                        console.log(coordinatesNames)
                        sum_der = math.string(math.derivative(g[j][m], coordinatesNames[i])) + "+" + math.string(math.derivative(g[m][i], coordinatesNames[j])) + "-" + math.string(math.derivative(g[i][j], coordinatesNames[m]))
                        L[nu][i][j] += "+(1/2*" + g_inv[nu][m] + "*(" + sum_der + "))";
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