//size of the window
const HEIGHT = window.innerHeight
const WIDTH = window.innerWidth

//defining a scene
var scene = new THREE.Scene();

//camera
var camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 0.1, 1000);
camera.position.z = 100;

//array that contains all geodesics(objects)
geodesis=[

]

//Menu
var gui = new dat.gui.GUI();
gui.domElement.id = 'gui';
start = false
var starter;
var options = {
    start_stop: function () {
        if (start) {
            starter.name('start')
        }
        else {
            starter.name('stop')
        }
        start = !start
    },

}
starter = gui.add(options, 'start_stop')
starter.name("start")

var adding=gui.addFolder("Add")
var infoToAdd ={
        colort: "#ffeb00",
        t: 1,
        x1: -100,
        x2: 47,
        x3: 0,
        velt: 1,
        velx1:  100,
        velx2: 0,
        velx3: 0,
}
//create one default object
addObject()

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
function addObject(){
    geodesis.push({cd: [infoToAdd.t, infoToAdd.x1, infoToAdd.x2, infoToAdd.x3], 
        vel:[infoToAdd.velt, infoToAdd.velx1, infoToAdd.velx2, infoToAdd.velx3], 
        pre_vel:[], points: [], line: 0,
        color:infoToAdd.colort,
        data:gui.addFolder(""+geodesis.length)
    })
    
    time_c=geodesis[geodesis.length-1].data.add(geodesis[geodesis.length-1].cd, "0").name("t")
    time_c.listen()
    c1=geodesis[geodesis.length-1].data.add(geodesis[geodesis.length-1].cd, "1").name("X1")
    c1.listen()
    c2=geodesis[geodesis.length-1].data.add(geodesis[geodesis.length-1].cd, "2").name("X2")
    c2.listen()
    c3=geodesis[geodesis.length-1].data.add(geodesis[geodesis.length-1].cd, "3").name("X3")
    c3.listen()
    vt=geodesis[geodesis.length-1].data.add(geodesis[geodesis.length-1].vel, "0").name("t")
    vt.listen()
    v1=geodesis[geodesis.length-1].data.add(geodesis[geodesis.length-1].vel, "1").name("Velocity X1")
    v1.listen()
    v2=geodesis[geodesis.length-1].data.add(geodesis[geodesis.length-1].vel, "2").name("Velocity X2")
    v2.listen()
    v3=geodesis[geodesis.length-1].data.add(geodesis[geodesis.length-1].vel, "3").name("Velocity X3")
    v3.listen()
}



//light to see objects
var general_light = new THREE.AmbientLight(0x909090)
scene.add(general_light);

//defining a render
var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);


//setting camera
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.enableZoom = true;
controls.enablePan = true;
controls.enableDamping = true;
controls.DampingFactor = 0.0;




//global variables
const dt = 0.01//the smallest amount of time
var time = 0.000//what time since the start
const R_s=15//Horizont radius

//macket of a black hole for better design
const sphere = new THREE.Mesh( new THREE.SphereGeometry( R_s, 32, 32 ), new THREE.MeshBasicMaterial( {color: 0x111111} ) );
scene.add( sphere );

//metric tensor
const g = [
    ['-(1-R/(x^2+y^2+z^2)^0.5)^2/(1+R/(x^2+y^2+z^2)^0.5)^2', '0', '0', '0'],
    ['0', '(1+R/(x^2+y^2+z^2)^0.5)^4', '0', '0'],
    ['0', '0', '(1+R/(x^2+y^2+z^2)^0.5)^4', '0'],
    ['0', '0', '0', '(1+R/(x^2+y^2+z^2)^0.5)^4']
]

//covariant metric tensor
const g_inv = invertMatrix(g);

//ordered name of coordinates that are used in the metric tensor
const coordinates_names = 'txyz';

//number of dimensions
const dn = g.length;

//calculating Crystoffel symbols
const Cr = generateChristoffel(g, g_inv);



//for not-cartesian coordinate systems
//translation to cartisian
function to_cartisian(x){
    return x
}
//translation from cartisian
function from_cartisian(x){
    return x
}


//creating geodesics
// geodesis.push({cd: [0, -100, 50, 0], vel:[1, 100, 0, 0], pre_vel:[], points: [], line: 0, menu:gui.addFolder(geodesis.length)})
// geodesis.push({cd: [0, -90, 0, 47], vel:[1, 100, 0, 0], pre_vel:[], points: [], line: 0, menu:gui.addFolder(geodesis.length)})
// geodesis.push({cd: [0, 0, -90, 40], vel:[1, 0, 100, 0], pre_vel:[], points: [], line: 0, menu:gui.addFolder(geodesis.length)})

// number_light=50;
// for(var i=-number_light/2;i<number_light/2;i++){
//     geodesis.push({cd: [0, -170, 500/number_light*i, 0], vel:[1, 2000, 0, 0], pre_vel:[], points: [], line: 0})
// }

//main loop, render
function render() {
    requestAnimationFrame(render);


    if (start) {
        //options.time += options.dt
        
        for(var count=0; count<geodesis.length; count++){


            geodesis[count].pre_vel=geodesis[count].vel


            for(var nu=0; nu<dn; nu++){
                for(var i=0; i<dn; i++){
                    for(var j=0; j<dn; j++){
                        scope={R:R_s}
                        for(var cd_name=0; cd_name<coordinates_names.length; cd_name++)
                            scope[coordinates_names[cd_name]]=geodesis[count].cd[cd_name]
                        
                        geodesis[count].vel[nu] -= math.evaluate(Cr[nu][i][j], scope) * geodesis[count].pre_vel[i] * geodesis[count].pre_vel[j] * dt
                    }
                }
            }
            
            //Euler
            for(var nu=0; nu<dn; nu++){
                geodesis[count].cd[nu] += (geodesis[count].vel[nu]+geodesis[count].pre_vel[nu])/2 * dt
            }
            

            cartesian = to_cartisian(geodesis[count].cd)

            geodesis[count].points.push(new THREE.Vector3(cartesian[1], cartesian[2], cartesian[3]))

            if(geodesis[count].line!=0)
                scene.remove(geodesis[count].line)
            material = new THREE.LineBasicMaterial({color: new THREE.Color(geodesis[count].color)});
            geometry = new THREE.BufferGeometry().setFromPoints(geodesis[count].points);

            geodesis[count].line = new THREE.Line(geometry, material);
            scene.add(geodesis[count].line);
            
        }
    }
    renderer.render(scene, camera);
}


//start the rendering function
render()