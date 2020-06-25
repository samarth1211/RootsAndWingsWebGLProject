var canvas = null;
var gl = null; // WebGL Context
var bFullscreen = false;
var canvas_original_width;
var canvas_original_height;

const WebGLMacros = 
{
	AMC_ATTRIBUTE_VERTEX:0,
	AMC_ATTRIBUTE_COLOR:1,
	AMC_ATTRIBUTE_NORMAL:2,
	AMC_ATTRIBUTE_TEXTURE0:3,
};

// Note : Tree Varibles need to be here ie initalized once and used many times
/*		Sphere Code start		*/

//Shader related variables
var s1_VertexShaderObject = null;
var s1_FragmentShaderObject = null;
var s1_ShaderProgramObject = null;

//VAO VBO
var s1_vao = null;
var s1_vbo_position = null;
var s1_vbo_normal = null;
var s1_vbo_texture = null;
var s1_vbo_color = null;

//Uniform variables
var s1_ModelMatrix_Uniform = null;
var s1_ViewMatrix_Uniform = null;
var s1_ProjectionMatrix_Uniform = null;

var s1_la_Uniform = null;
var s1_ld_Uniform = null;
var s1_kd_Uniform = null;
var s1_LightPosition_Uniform = null;
var s1_AlphaValue_Sphere_Uniform = null;
var s1_uniform_texture0_sampler = null;
//Matrices
var s1_ModelMatrix;
var s1_ViewMatrix;

//Sphere class Obj
var sphereMesh = null;

var s1_SphereLightPosition = [100.0, 100.0, 100.0, 1.0];
var sphereTexture = null;
var s1_Sphere_Angle = 11.0;
var translateBallY = 0.0;


/* Sphere Code Stop */

/*Tree Variables Start */
// Prep shader program
var vertexShaderObject_tree;
var fragmentShaderObject_tree;
var shaderProgramObject_tree;

var vertexShaderObject_root;
var fragmentShaderObject_root;
var shaderProgramObject_root;

// prep uniforms
var uniform_ModelMat_tree;
var uniform_ViewMat_tree;
var uniform_ProjectionMat_tree;
var uniform_texSampler_tree;
var uniform_AlphaValue_tree;

var uniform_ModelMat_root;
var uniform_ViewMat_root;
var uniform_ProjectionMat_root;
var uniform_texSampler_root;
var uniform_alphaValue_root;

var vertexArrayObject_tree;
var vertexBufferObject_tree;
var vertexBufferObject_Elements_tree;

var vertexArrayObject_root;
var vertexBufferObject_root;
var vertexBufferObject_Elements_root;

var texture_bark = null;
 var texture_leaf = null;

var perspectiveProjectionMatrix;

// other variables
var pt, ind, off,pi,pi2, pi0 = 3000000, su = 33,sv = 9, rnd, irnd,
    leaf = true, lev = 8, thr1 = .6, thr2 = .6, fir = 3,
    th1 = -.8, fi1 = 2, th2 = -.5, fi2 = 0, sclen = .8, scr1 = .6,
    anim = 0.5, bAnim = true, uAnim, green = false, first = true,
	frames = 0, time;
	
var transl = -36;
var commonTransl = -36.4;
var tree_angle = 0;
var tree_Y_rot = 23.059999999999697;
//var tree_Y_rot = 4.009999999999937;
var tree_Z_rot = 3.15; 

var tree_root_ref_angle = 1.5099999999999898;//1.3249999999999937

//var root_Y_rot = tree_Y_rot - 1.8;//5.214999999999911
var root_Y_rot = 5.214999999999911;

var ref_rot_angle = 5.289999999999909;
//var ref_rot_angle = 7.664999999999859;
// Roots Variables
var pt_root, ind_root, off_root, pi_root, pi2_root, pi0_root = 3000000, su_root = 33; 
var sv_root = 20, rnd_root, irnd_root;
// constants
var green = false;
var lev_root = 7; // integer
// floating points
var thr1_root = 0.6, thr2_root = 0.55, fir_root = 1.3;
var th1_root = -0.2, fi1_root = 0, th2_root = -.75, fi2_root = 0.35, sclen_root = 0.8, scr1_root = .6;

var drawLeavesArray = new Float32Array([0.0001,0.1,0.2,0.5,0.7,1.0,1.0]);
var showLeavesIndex = 0;
/*Tree Variables Stop */

/* Looka at variables for scene 2 */
var winner_sphere_Ypos = 16.5;
var winner_sphere_transflag = false;
var winner_sphere_reached_last = false;

var sc2_LA_Sphere_Ypos = -10.85;

// Look at variables start
var s2_lookatScene = false;
var s2_lookatflag = false;
var tree_x_posn = 0.0;
var tree_y_posn = 0.0;
var tree_z_posn = 0.0;

var root_x_posn = 0.0;
var root_y_posn = 0.0;
var root_z_posn = 0.0;
// Look at variables stop

// helix lookat variable
var num_points = 1000;
var index = 0;
var animate = 0.0;
var helixVertices = new Float32Array(3000);

/* All Control Variables Start*/
var control_splashScreen = true;
var control_scene1 = false;
// below two varibles have scene 2,3 and 4
var control_scene2 = false;
var control_scene2_lookat = false;
// scene 5 onwards
var control_scene5 = false;
var control_logo = false;

var global_audio_counter = 0;
var bIsAnimating = false;
/* All Control Variables Stop*/

var bShowAMC = false;

/* variables for logo shader */
var vertexShaderObject_final_logo_root;
var fragmentShaderObject_final_logo_root;
var shaderProgramObject_final_logo_root;

// Uniforms
var uniform_ModelMat_final_logo_root;
var uniform_ViewMat_final_logo_root;
var uniform_ProjectionMat_final_logo_root;
/* variables for logo shaders stop*/


/* All fade ins Start*/
var scene1_fadeIN_flag= false;
var scene1_fadeIN_varibale = 0.0;
/* All fade ins Stop */

// To start Animation: To have requestAnimationFrame() to be called "cross-browser" compatible
var requestAnimationFrame = window.requestAnimationFrame|| 
							window.webkitRequestAnimationFrame || 
							window.mozRequestAnimationFrame || 
							window.oRequestAnimationFrame||
							window.msRequestAnimationFrame;

// To stop Animation: To have cancleAnimationFrame() to be called "cross-browser" compatible
var cancleAnimationFrame = window.cancleAnimationFrame ||
						   window.webkitCancleRequestAnimationFrame||
						   window.webkitCancleAnimationFrame||
						   window.mozCancleRequestAnimationFrame ||
						   window.mozCancleAnimationFrame ||
						   window.oCancleRequestAnimationFrame||
						   window.oCancleAnimationFrame||
						   window.msCancleRequestAnimationFrame||
						   window.msCancleAnimationFrame;


// create audio context
const AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext ;

function samMain()
{
	canvas = document.getElementById("SamCanvas");
	
	if(!canvas)
		console.log("Obtaining Canvas Failed...!!");
	else
		console.log("Obtaining Canvas Successful...!!");
	
	console.log("Canvas Dimensions Canvas Width:"+canvas.width+" Canvas Height:"+canvas.height+" \n");
	canvas_original_width = canvas.width;
	canvas_original_height = canvas.height;
	
	window.addEventListener("keydown",samKeyDown,false);
	window.addEventListener("click",samMouseDown,false);
	window.addEventListener("resize",samResize,false);

	audioContext = new AudioContext();

	/*	Audio Start	*/
	// get the audio element
	const audioElement = document.querySelector('audio');

	// pass it into the audio context
	const track = audioContext.createMediaElementSource(audioElement);
	track.connect(audioContext.destination);

	audioElement.play();
	audioElement.pause();
	/*	Audio Stop 	*/

	// initialize WebGL
	samInit();

	// start drawing here as warming-up
	samResize();

	samDraw();
	
}

function samKeyDown(event)
{
	switch(event.keyCode)
	{
		case 27:
			control_scene1 = false;
			control_scene2 = false;
			control_scene2_lookat = false;
			control_scene5 = false;
			control_splashScreen = false;
			control_logo = false;
		samUninitialize();
		window.close();
		break;
		case 70:
		toggleFullScreen();
		break;

		case 32:
			control_splashScreen = false;
			if (bIsAnimating == false)
			{
				//control_scene1 = true;
				bIsAnimating = true;
				
				audioElement.resume()
			}
			
			//control_scene2 = true;
		break;
		// w or W
		/*case 87:
		case 119:
				transl = transl  + 1.0;
		break;

		// s or s
		case 83:
		case 115:
				transl = transl  - 1.0;
		break;*/

		// p or P
		case 80:
		case 112:
			console.log("counter =>" + global_audio_counter);
			break;
			
		// i	
		/*case 105:
			showLeavesIndex--;
			if (showLeavesIndex <= 0)
			{
				showLeavesIndex=0;
			}
			break; 	

			// I
		case 73:
			showLeavesIndex++;
			if (showLeavesIndex > 5)
			{
				showLeavesIndex = 5;
			}
			break;*/	
	}
	
	
}

function samMouseDown(event)
{
	
}

function samInit()
{
	gl = canvas.getContext("webgl2");
	if (gl==null) 
	{
		console.log("Failed to get rendering context for WenGL");
		return;
	}

	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;

	/* START: vertexshader- fragmentshader - shaderprogram object for final logo root */
	/* Tree Setup Start */
	var vertexShaderSourceCode_final_logo_root =
		"#version 300 es" +
		"\n" +
		"in vec3 vPosition;" +
		"in vec3 vColor;" +
		"in vec2 vTexture0_Coord;" +
		"out vec2 out_texture0_coord;" +
		"out vec3 outColor;" +
		"uniform mat4 u_m_matrix;" +
		"uniform mat4 u_v_matrix;" +
		"uniform mat4 u_p_matrix;" +
		"void main (void)" +
		"{" +
		"gl_Position = (u_p_matrix * u_v_matrix * u_m_matrix) * vec4(vPosition.x,vPosition.y,vPosition.z,1.0);" +
		"out_texture0_coord = vTexture0_Coord;" +
		"outColor = vColor;" +
		"}";
	vertexShaderObject_final_logo_root = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_final_logo_root, vertexShaderSourceCode_final_logo_root);
	gl.compileShader(vertexShaderObject_final_logo_root);
	if (gl.getShaderParameter(vertexShaderObject_final_logo_root, gl.COMPILE_STATUS) == false) {
		var error = gl.getShaderInfoLog(vertexShaderObject_final_logo_root);
		if (error.length > 0) {
			alert(error);
			samUninitialize();
		}
	}

	// fragment shader
	var fragmentShaderSourceCode_final_logo_root =
		"#version 300 es" +
		"\n" +
		"precision highp float;" +
		"in vec2 out_texture0_coord;" +
		"in vec3 outColor;" +
		"out vec4 FragColor;" +
		"void main (void)" +
		"{" +
		"FragColor = vec4(1.0);" +
		"}";

	fragmentShaderObject_final_logo_root = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_final_logo_root, fragmentShaderSourceCode_final_logo_root);
	gl.compileShader(fragmentShaderObject_final_logo_root);

	if (!gl.getShaderParameter(fragmentShaderObject_final_logo_root, gl.COMPILE_STATUS)) {
		var error = gl.getShaderInfoLog(fragmentShaderObject_final_logo_root);
		if (error.length > 0) {
			alert(error);
			samUninitialize();
		}
	}

	// shader program
	shaderProgramObject_final_logo_root = gl.createProgram();
	gl.attachShader(shaderProgramObject_final_logo_root, vertexShaderObject_final_logo_root);
	gl.attachShader(shaderProgramObject_final_logo_root, fragmentShaderObject_final_logo_root);

	// pre-link building of shader
	gl.bindAttribLocation(shaderProgramObject_final_logo_root, WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(shaderProgramObject_final_logo_root, WebGLMacros.AMC_ATTRIBUTE_COLOR, "vColor");
	gl.bindAttribLocation(shaderProgramObject_final_logo_root, WebGLMacros.AMC_ATTRIBUTE_TEXTURE0, "vTexture0_Coord");

	//link
	gl.linkProgram(shaderProgramObject_final_logo_root);
	if (!gl.getProgramParameter(shaderProgramObject_final_logo_root, gl.LINK_STATUS)) {
		var error = gl.getProgramParameter(shaderProgramObject_final_logo_root, gl.LINK_STATUS);
		if (error.length > 0) {
			alert(error);
			samUninitialize();
		}
	}

	uniform_ModelMat_final_logo_root = gl.getUniformLocation(shaderProgramObject_final_logo_root, "u_m_matrix");
	uniform_ViewMat_final_logo_root = gl.getUniformLocation(shaderProgramObject_final_logo_root, "u_v_matrix");
	uniform_ProjectionMat_final_logo_root = gl.getUniformLocation(shaderProgramObject_final_logo_root, "u_p_matrix");

	/* END: vertexshader- fragmentshader - shaderprogram object for final logo root */

	logo_quad_init();
	samInit_font();


	Text_Init();
	s1_Init();
	treeInit();	

	parabola_init();
	scene5_Ball_Init();

	// init model main
	model_main();
	
	title_text_Init();
	title_init();
	

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.CULL_FACE);
	gl.clearColor(0.15,0.15,0.15,1.0);

	perspectiveProjectionMatrix = mat4.create();
	//toggleFullScreen();
}

function toggleFullScreen()
{
	
	var fullscreen_element = document.fullscreenElement || document.webkitFullscreenElement || 
	document.mozFullScreenElement || document.msFullscreenElement|| null;
	
	// if not full Screen
	if(fullscreen_element==null)
	{
		if(canvas.requestFullscreen)
			canvas.requestFullscreen();
		else if(canvas.mozRequestFullScreen)
			canvas.mozRequestFullScreen();
		else if(canvas.webkitRequestFullscreen)
			canvas.webkitRequestFullscreen();
		else if (canvas.msRequestFullscreen)
			canvas.msRequestFullscreen();

		bFullscreen = true;
	}
	else // if Already Full Screen
	{
		if(document.exitFullscreen)
			document.exitFullscreen();
		else if(document.mozCancleFullScreen)
			document.mozCancleFullScreen();
		else if (document.webkitExitFullscreen)
			document.webkitExitFullscreen();
		else if(document.msExitFullscreen)
			document.msExitFullscreen();

		bFullscreen = false;
	}
	
}


function samResize()
{
	if(bFullscreen ==  true)
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	else
	{
		canvas.width = canvas_original_width ;
		canvas.height = canvas_original_height ;
	}

	gl.viewport(0,0,canvas.width,canvas.height);

	mat4.perspective(perspectiveProjectionMatrix,45.0,canvas.width/canvas.height,0.1,100.0);

}

function samDraw()
{

	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

	if (control_logo) 
	{
		var modelMatrix = mat4.create();
		var viewMatrix = mat4.create();

		var translateMatrix = mat4.create();
		var rotationMatrix = mat4.create();
		var scaleMatrix = mat4.create();

		// other drawing
		samDraw_font();
		draw_logo_quad();

		
		mat4.translate(translateMatrix, translateMatrix, [0.0, 0.0, -60]);
		mat4.rotateZ(rotationMatrix, rotationMatrix, 3.02);
		mat4.rotateY(rotationMatrix, rotationMatrix, 4.009);
		mat4.scale(scaleMatrix, scaleMatrix, [1.3, 0.9, 1.0])

		mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
		mat4.multiply(modelMatrix, modelMatrix, scaleMatrix);
		mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

		gl.useProgram(shaderProgramObject_final_logo_root);
		gl.uniformMatrix4fv(uniform_ModelMat_final_logo_root, false, modelMatrix);
		gl.uniformMatrix4fv(uniform_ViewMat_final_logo_root, false, viewMatrix);
		gl.uniformMatrix4fv(uniform_ProjectionMat_final_logo_root, false, perspectiveProjectionMatrix);

		// root
		gl.bindVertexArray(vertexArrayObject_root);			// bind to vao of tree							
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBufferObject_Elements_root);
		gl.enable(gl.CULL_FACE);
		gl.drawElements(gl.TRIANGLES, pi_root, gl.UNSIGNED_INT, 0);
		//leaves
		gl.disable(gl.CULL_FACE);
		//gl.drawElements(gl.TRIANGLES, (pi2_root - pi0_root)/1, gl.UNSIGNED_INT, 4*pi0_root);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindVertexArray(null);							// bind to vao of tree

		gl.useProgram(null);
	}

	if (control_scene1)
	{
		s1_Draw();
	}

	if (control_scene2)
	{
		treeDisplay();
	}

	if (control_scene2_lookat)
	{
		scene2treeDisplayWithLookAt();
	}


	if (control_scene5)
	{
		model_draw();
		scene5_Ball_Draw();
	}

	samUpdate();
	// animation loop
	requestAnimationFrame(samDraw,canvas);
}

function samUpdate()
{
	if (bIsAnimating)
	{
		global_audio_counter = global_audio_counter + 1;
	}

	/*Set all Flags Start */
	if (global_audio_counter == 300)
	{
		control_scene1 = true;
		scene1_fadeIN_flag = true;
	}
	/*Set all Flags Start */
	if (global_audio_counter == 3020) {
		control_scene2 = true;
		control_scene1 = false;
	}
	
	if(control_splashScreen)
	{
		titleDisplayText();
	}

	if (control_scene1)
	{
		s1_Update();	
	}


	if (control_scene2)
	{
		treeUpdate();
	}
	
	if (global_audio_counter == 5300) {
		control_scene2_lookat = true;
		s2_lookatflag = true;
		control_scene2 = false;
	}

	if (control_scene2_lookat)
	{
		scene2TreeUpdateLookAt();
	}
	
	// Blend previous scene
	if (global_audio_counter == 8790) {
		control_scene5 = true;
		control_scene2 = false;
		control_scene2_lookat = false;
	}   
	
	if(global_audio_counter == 8852)
	{
		bHop1 = true;
	}


	if (global_audio_counter == 10281)
	{
		control_scene5 = false;
		control_logo = true;
	}

}


function samUninitialize()
{

	//s1_Uninitialize();
	s1_Uninitialize();
	scene2TextUnintialize();

	treeUnitialize();
	text_Uninitialize();

	model_uninitialize();

	//uninitialize logo quad
	logo_quad_uninitialize();
	//text_uninitialize();
	samUninitialize_font();
}


function tree(){
	off = 0; pi = 0; pi2 = pi0;  irnd = 0
	var b1 = new Float32Array([0,1,0, 0,0,1, 1,0,0, 0,0,0, 0,0]);
	var b2 = new Float32Array(b1);
	var b3 = new Float32Array(b1);
	var b4 = new Float32Array(b1);
	var b5 = new Float32Array(b1);
	
	base(b1, 0, 0, 0, 0, 0, 0, 0);
	//twig(b1, .1,0, 1.2,1, 1,1, 2,1);
	rami(b1,b2, -thr1,thr2,fir, 1,.75,.75, 3.,2.5,2.5, .3, 4);
	rami(b1,b3, -thr1,thr2,fir, .75,.5,.5, 1.,1.5,1.5, .3, 4);
	rami(b2,b4, -thr1,thr2,fir, .75,.5,.5, 1.,1.5,1.5, .3, 4);
	rami(b3,b5, -thr1,thr2,fir, .5,.5,.5, 1.,1.5,1.5, .3, 4);
	
	branch(lev, b1, .5,1.5, 4,[0,1,1,0,0,0,0,0,0]);
	branch(lev, b2, .5,1.5, 4,[0,1,1,0,0,0,0,0,0]);
	branch(lev, b3, .5,1.5, 4,[0,1,1,0,0,0,0,0,0]);
	branch(lev, b4, .5,1.5, 4,[0,1,1,0,0,0,0,0,0]);
	branch(lev, b5, .5,1.5, 4,[0,1,1,0,0,0,0,0,0]);
 
	var t = off/8, i = 0,  r = 5; // ground
	var gr = [-r,-r, r,-r, -r,r, r,r];
	
	/*for(var j = 0; j < 4; j++ )
	{
	  pt[off++] = gr[i++];  
	  pt[off++] = 0;  
	  pt[off++] = gr[i++];
	  pt[off++] = 0; 
	  pt[off++] = .6;  
	  pt[off++] = 0;
	  pt[off++] = 0; 
	  pt[off++] = 0 ;
	}*/

	ind[pi2++] = t++;  ind[pi2++] = t;  ind[pi2++] = t+1;
	ind[pi2++] = t++; ind[pi2++] = t++; ind[pi2++] = t;

 }
 function branch(it, b, sr,sb, stu,div)
 {

	var b2 = new Float32Array(b),  sr2 = sr*3;
	rami(b,b2, -thr1,thr2,fir, sr,.8*sr,.8*sr, sr2,sr2,sr2, .3, stu);
	var di = div[it], sr1 = scr1*sr, sr2 = .6*sr;
	twig(b, th1,fi1, .8*sr,sr1, sb,sb, stu,di);
	twig(b2, th2,fi2, .8*sr,sr2, sb,sb, stu,di);
	if(di) stu *= 2;
	it--;
	if(it == 0)
	{

	  if(leaf)
	  { 
		leaves3(b, sr1, green); 
		leaves3(b2, sr2, green);
	  }
	  return ;
	}
	branch(it, b, sr1, sb*sclen, stu,div);
	branch(it, b2, sr2, sb*sclen, stu,div);
 }

 function roots()
 {
	 off_root = 0; pi_root = 0; pi2_root = pi0_root; irnd_root = 0;

	 var b1_root = new Float32Array([0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]);
	 var b2_root = new Float32Array(b1_root);
	 var b3_root = new Float32Array(b1_root);
	 var b4_root = new Float32Array(b1_root);
	 //var b5_root = new Float32Array(b1_root);

	 base(b1_root, 0, 0, 0, 0, 0, 0, 0);
	 rami_root(b1_root, b2_root, -thr1_root, thr2_root, fir_root, 1, .75, .75, 3., 2.5, 2.5, .3, 4);
	 rami_root(b1_root, b3_root, -thr1_root, thr2_root, fir_root, .75, .5, .5, 1., 1.5, 1.5, .3, 4);
	 rami_root(b2_root, b4_root, -thr1_root, thr2_root, fir_root, .75, .5, .5, 1., 1.5, 1.5, .3, 4);
	 //rami_root(b3_root, b5_root, -thr1_root, thr2_root, fir_root, .5, .5, .5, 1., 1.5, 1.5, .3, 4);

	 branch_root(5, b1_root, .5, 1.5, 4, [0, 1, 1, 0, 0, 0, 0, 0, 0]);
	 branch_root(6, b2_root, .5, 1.5, 4, [0, 1, 1, 0, 0, 0, 0, 0, 0]);
	 branch_root(6, b3_root, .5, 1.5, 4, [0, 1, 1, 0, 0, 0, 0, 0, 0]);
	 branch_root(5, b4_root, .5, 1.5, 4, [0, 1, 1, 0, 0, 0, 0, 0, 0]);
	 //branch_root(2, b5_root, .5, 1.5, 4, [0, 1, 1, 0, 0, 0, 0, 0, 0]);


	 var t_root = off_root / 8, i = 0, r = 5; // ground
	 //var gr = [-r,-r, r,-r, -r,r, r,r];

	 ind_root[pi2_root++] = t_root++;
	 ind_root[pi2_root++] = t_root;
	 ind_root[pi2_root++] = t_root + 1;
	 ind_root[pi2_root++] = t_root++;
	 ind_root[pi2_root++] = t_root++;
	 ind_root[pi2_root++] = t_root;

 }


function branch_root(it, b, sr, sb, stu, div) 
{
	var b2 = new Float32Array(b), sr2 = sr * 3;
	rami_root(b, b2, -thr1_root, thr2_root, fir_root, sr, .8 * sr, .8 * sr, sr2, sr2, sr2, .3, stu);
	var di = div[it], sr1 = scr1_root * sr, sr2 = .6 * sr;
	twig_root(b, th1_root, fi1_root, .8 * sr, sr1, sb, sb, stu, di);
	twig_root(b2, th2_root, fi2_root, .8 * sr, sr2, sb, sb, stu, di);
	if (di) stu *= 2;
	it--;
	if (it == 0) {
		if (leaf) {
			//leaves3(b, sr1, green);
			//leaves3(b2, sr2, green);
		}
		return;
	}
	branch_root(it, b, sr1, sb * sclen_root, stu, div);
	branch_root(it, b2, sr2, sb * sclen_root, stu, div);
}

 function rand()
 {
   for(var i = 0; i < 5*3000; i++ ) rnd[i] = Math.random()
 }


 /*

 Look for angles
 Angle is 5.1449999999999125 Canvas_Handler.js:147:12
Angle is 7.374999999999865 Canvas_Handler.js:147:12
Angle is 19.87000000000033 Canvas_Handler.js:147:12
Angle is 23.059999999999697 Canvas_Handler.js:147:12
Angle is 23.419999999999625
 */
