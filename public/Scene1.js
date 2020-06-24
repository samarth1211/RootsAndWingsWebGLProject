//scene1
/*
//Shader related variables
var s1_VertexShaderObject =null;
var s1_FragmentShaderObject=null;
var s1_ShaderProgramObject=null;

//VAO VBO
var s1_vao=null;
var s1_vbo_position=null;
var s1_vbo_normal=null;
var s1_vbo_texture=null;
var s1_vbo_color=null;

//Uniform variables
var s1_ModelMatrix_Uniform=null;
var s1_ViewMatrix_Uniform=null;
var s1_ProjectionMatrix_Uniform=null;

var s1_la_Uniform = null;
var s1_ld_Uniform = null;
var s1_kd_Uniform = null;
var s1_LightPosition_Uniform = null;
var s1_AlphaValue_Uniform = null;
//
var s1_uniform_texture0_sampler = null;
//Matrices
var s1_ModelMatrix;
var s1_ViewMatrix;

//Sphere class Obj
var sphereMesh; 

var s1_SphereLightPosition = [100.0, 100.0, 100.0, 1.0];
var sphereTexture = null;
var s1_Sphere_Angle = 11.0;
var translateBallY=0.0;
//Functions call by others
*/


var blackOut_variable = 1.0;
function s1_Init()
{
	subS1_Init();
    var s1_VertexShaderSourceCode = 
	"#version 300 es" +
	"\n" +
	"in vec4 vPosition;" +
	"in vec3 vNormal;" +
	"in vec2 vTexture0_Coord;" +
    
    "uniform mat4 u_m_matrix;" +
	"uniform mat4 u_v_matrix;" +
	"uniform mat4 u_p_matrix;" +
	//light
	"uniform vec3 u_la;" + 
    "uniform vec3 u_ld;" +
	"uniform vec3 u_kd;" +
	"uniform vec3 u_light_position;" +

	//"out vec4 out_color;" +
	"out vec3 difuse_light;" +
	"out vec2 out_texture0_coord;" +
	"void main(void)" +
	"{" +
			"vec4 eyeCoord = u_v_matrix * u_m_matrix * vPosition;" +
			"vec3 tnorm = normalize(mat3(u_v_matrix * u_m_matrix) * vNormal);" +
			"vec3 s = normalize(vec3(u_light_position - (eyeCoord).xyz));" +
			"difuse_light = u_la + (u_ld * u_kd * max(dot(s, tnorm), 0.0));" +

			"out_texture0_coord = vTexture0_Coord;" +
			"gl_Position = u_p_matrix *  u_v_matrix * u_m_matrix * vPosition;" +
			
	"}";
	
	s1_VertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(s1_VertexShaderObject,s1_VertexShaderSourceCode);
	gl.compileShader(s1_VertexShaderObject);
	
	if(gl.getShaderParameter(s1_VertexShaderObject,gl.COMPILE_STATUS)==false)
	{
		var error = gl.getShaderInfoLog(s1_VertexShaderObject);
		if(error.length > 0)
		{
			alert("VERTEXT SHADER EROOR");
			s1_Uninitialize();
		}
	}
	
	//fragment shader
	var s1_FragmentShaderSourceCode = 
	"#version 300 es" +
	"\n" +
	
	"precision highp float;" +
	"in vec3 difuse_light;" +
	"in vec2 out_texture0_coord;" +
	"uniform highp sampler2D u_texture0_sampler;" +
	"uniform float u_AlphaValue;" +
	//"in vec4 out_color;" +
	"out  vec4 FragColor;" +
	"void main(void)" +
	"{" +
		"highp vec4 tex = texture(u_texture0_sampler, out_texture0_coord);" +
		"FragColor = vec4((tex.rgb * difuse_light), u_AlphaValue);" +
		//"FragColor = vec4(tex.rgb, 1.0);" +
	"}";
	
	s1_FragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(s1_FragmentShaderObject,s1_FragmentShaderSourceCode);
	gl.compileShader(s1_FragmentShaderObject);
	
	if(gl.getShaderParameter(s1_FragmentShaderObject,gl.COMPILE_STATUS)==false)
	{
		var error = gl.getShaderInfoLog(s1_FragmentShaderObject);
		if(error.length > 0)
		{
			alert("FRAGMENT SHADER EROOR: " + error);
			s1_Uninitialize();
		}
	}
	//shader program
	s1_ShaderProgramObject = gl.createProgram();
	gl.attachShader(s1_ShaderProgramObject, s1_VertexShaderObject);
	gl.attachShader(s1_ShaderProgramObject, s1_FragmentShaderObject);
	
	//prelinking
	gl.bindAttribLocation(s1_ShaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");
	gl.bindAttribLocation(s1_ShaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_NORMAL, "vNormal");
	gl.bindAttribLocation(s1_ShaderProgramObject, WebGLMacros.AMC_ATTRIBUTE_TEXTURE0,"vTexture0_Coord");
	//linking
	gl.linkProgram(s1_ShaderProgramObject);
	if(!gl.getProgramParameter(s1_ShaderProgramObject, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(s1_ShaderProgramObject);
		if(error.length > 0)
		{
				alert("LINK ERROR : "+ error);
				s1_Uninitialize();
		}
	}
	
	//Post Link..getting uniforms locations
	//mvp
    s1_ModelMatrix_Uniform = gl.getUniformLocation(s1_ShaderProgramObject, "u_m_matrix");   
	s1_ViewMatrix_Uniform = gl.getUniformLocation(s1_ShaderProgramObject, "u_v_matrix");
    s1_ProjectionMatrix_Uniform = gl.getUniformLocation(s1_ShaderProgramObject, "u_p_matrix");
	
	//light   
	s1_la_Uniform = gl.getUniformLocation(s1_ShaderProgramObject, "u_la");
	s1_ld_Uniform = gl.getUniformLocation(s1_ShaderProgramObject, "u_ld");
	s1_kd_Uniform = gl.getUniformLocation(s1_ShaderProgramObject, "u_kd");
	s1_LightPosition_Uniform = gl.getUniformLocation(s1_ShaderProgramObject, "u_light_position");
	s1_AlphaValue_Sphere_Uniform = gl.getUniformLocation(s1_ShaderProgramObject, "u_AlphaValue");

	//Tetxure
	s1_uniform_texture0_sampler = gl.getUniformLocation(s1_ShaderProgramObject,"u_texture0_sampler");
	////////////******Vertices color texcoord, vao vbo*****///////////
	//Load Sphere Data
	sphereMesh = new Mesh();
	//call syntax makeSphere(sphereMesh, fRadius, iSlices, iStacks)
	makeSphere(sphereMesh, 2.0, 100, 50);

	///Texture Gen
	//START:
	console.log("Texture Gen Started!!!");
	sphereTexture = gl.createTexture();
	sphereTexture.image = new Image();
	sphereTexture.image.src = "sphere.png";
	sphereTexture.image.onload = function()
	{
		gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //Changing Y axis
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sphereTexture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //if NEAREST use ..no need to use mipmap
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	console.log("Texture Gen End!!!");
	
    
    // //START:
    // s1_vao = gl.createVertexArray();
    // gl.bindVertexArray(s1_vao);

    // s1_vbo_position = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, s1_vbo_position);
    // gl.bufferData(gl.ARRAY_BUFFER, pyramid_vertices, gl.STATIC_DRAW);
    // gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false , 0, 0);
    // gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);

    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // //color
    // s1_vbo_color = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, s1_vbo_color);
    // gl.bufferData(gl.ARRAY_BUFFER, pyramid_color, gl.STATIC_DRAW);
    // gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR, 3, gl.FLOAT, false , 0, 0);
    // gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);

    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // gl.bindVertexArray(null);
}

//Draw 
function s1_Draw()
{

    //Draw required shapes
    gl.useProgram(s1_ShaderProgramObject);
    
    s1_ModelMatrix=mat4.create();
    s1_ViewMatrix = mat4.create();
    
	var translateMatrix = mat4.create();
    var scaleMatrix = mat4.create();
    var rotationMatrix = mat4.create();

	if(readyforScene2==true)
	{
		translateBallY=translateBallY-0.1;

		if (translateBallY <= -15.0)
		{
			//console.log("In ");
			blackOut_variable = blackOut_variable - 0.01;
			if (blackOut_variable < 0.0) 
			{
				blackOut_variable = 0.0;
				control_scene2 = true;
				control_scene1 = false;
			}
		}
	}
	mat4.translate(translateMatrix, translateMatrix,[0.0,translateBallY,-20.0]);
	mat4.rotateX(rotationMatrix, rotationMatrix, s1_Sphere_Angle);
	//mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(1.5,1.5,1.5));
	
	mat4.multiply(s1_ModelMatrix,rotationMatrix,s1_ModelMatrix);
	//mat4.multiply(s1_ModelMatrix, scaleMatrix,s1_ModelMatrix);
	mat4.multiply(s1_ModelMatrix,translateMatrix,s1_ModelMatrix);
	
	//Push uniforms
	//START:
		//mvp
		gl.uniformMatrix4fv(s1_ModelMatrix_Uniform,false,s1_ModelMatrix);
		gl.uniformMatrix4fv(s1_ViewMatrix_Uniform,false,s1_ViewMatrix);
		gl.uniformMatrix4fv(s1_ProjectionMatrix_Uniform,false,perspectiveProjectionMatrix);

		//light
		gl.uniform3f(s1_la_Uniform, 0.2,0.2,0.2);
		gl.uniform3f(s1_ld_Uniform,1.0,1.0,1.0);
		gl.uniform3f(s1_kd_Uniform,.5,.5,.5);
	if (scene1_fadeIN_flag)
	{
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.uniform1f(s1_AlphaValue_Sphere_Uniform, scene1_fadeIN_varibale);
		//Bind with texture
		//STRAT:
		gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
		gl.uniform1i(s1_uniform_texture0_sampler, 0);
		//END:

		//Draw shapes
		sphereMesh.draw();
		gl.disable(gl.BLEND);
	}
	else
	{
		gl.uniform1f(s1_AlphaValue_Sphere_Uniform, 1.0);
		//Bind with texture
		//STRAT:
		gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
		gl.uniform1i(s1_uniform_texture0_sampler, 0);
		//END:

		//Draw shapes
		sphereMesh.draw();
	}
		

		//gl.uniform4fv(s1_LightPosition_Uniform, s1_SphereLightPosition);
	//END

	
    gl.useProgram(null);


	gl.enable(gl.CULL_FACE);

	subS1_Draw();
	subS1_Update();
	
	gl.disable(gl.CULL_FACE);
}

//update
function s1_Update()
{
	if (scene1_fadeIN_flag)
	{
		scene1_fadeIN_varibale = scene1_fadeIN_varibale + 0.005;
		if (scene1_fadeIN_varibale > 1.0)
		{
			scene1_fadeIN_varibale = 1.0;
			scene1_fadeIN_flag=false;
		}

	}
    //code
	subS1_Update();
}

function s1_Uninitialize()
{
	subS1_Uninitialize();
	if(s1_vao)
	{
		gl.deleteVertexArray(s1_vao);
		s1_vao = null;
	}

	if(s1_vbo_position)
	{
		gl.deleteBuffer(s1_vbo_position);
		s1_vbo_position = null;
	}

	if(s1_vbo_color)
	{
        gl.deleteBuffer(s1_vbo_color);
		s1_vbo_color = null;
    }
    if(s1_vbo_texture)
	{
        gl.deleteBuffer(s1_vbo_texture);
		s1_vbo_texture = null;
    }
    if(s1_vbo_normal)
	{
        gl.deleteBuffer(s1_vbo_normal);
		s1_vbo_normal = null;
	}
    
     if(s1_FragmentShaderObject)
	 {
	 	gl.detachShader(s1_ShaderProgramObject, s1_FragmentShaderObject);
	 	gl.deleteShader(s1_FragmentShaderObject);
	 	s1_FragmentShaderObject = null;

	 }

	 if(s1_VertexShaderObject)
	 {
	 	gl.detachShader(s1_ShaderProgramObject, s1_VertexShaderObject);
		gl.deleteShader(s1_VertexShaderObject);
	 	s1_VertexShaderObject = null;

     }
            
	if(s1_ShaderProgramObject)
	{
		gl.deleteProgram(s1_ShaderProgramObject);
		s1_ShaderProgramObject = null;
	}
}
